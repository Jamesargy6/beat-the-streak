import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { DynamoBaseItemType, DynamoConfig } from './types'

const MAX_CHUNK_SIZE = 25
class DynamoClient<T extends DynamoBaseItemType> {
  _c: new () => T
  _client: DynamoDBDocument
  _dynamoConfig: DynamoConfig
  constructor(c: new () => T, client: DynamoDBDocument, dynamoConfig: DynamoConfig) {
    this._c = c
    this._client = client
    this._dynamoConfig = dynamoConfig
  }

  _chunkArray (arr: Array<object>, size: number): Array<Array<object>> {
    return arr.length > size
      ? [arr.slice(0, size), ...this._chunkArray(arr.slice(size), size)]
      : [arr]
  }

  async write(item: T) {
    const [tableName] = this._dynamoConfig
    await this._client.put({ 
      TableName: tableName,
      Item: item
    })
  }

  async batchWrite (items: Array<T>) {
    const [tableName] = this._dynamoConfig
    const requests = items.map(item => ({ PutRequest: { Item: item } }))
    const requestChunks = this._chunkArray(requests, MAX_CHUNK_SIZE)
    
    const batchWriteInputs = requestChunks.map(requestChunk => ({
      RequestItems: {
        [tableName]: requestChunk
      }
    }))

    const batchWritePromises = batchWriteInputs.map(input => this._client.batchWrite(input))
    await Promise.all(batchWritePromises)
  }

  async read(partitionKeyValue: string | number, sortKeyValue?: string | number): Promise<T> {
    const [tableName, partitionKey, sortKey] = this._dynamoConfig
    const getCommandInputKey = { [partitionKey]: partitionKeyValue }
    sortKey && sortKeyValue ? getCommandInputKey[sortKey] = sortKeyValue : {}
    const { Item: result } = await this._client.get({
      TableName: tableName,
      Key: getCommandInputKey
    })
    const dynamoItem = Object.assign(new this._c, result)
    return dynamoItem
  }
}

export { DynamoClient }
