import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { InvalidIndexException, InvalidSortKeyException, NotFoundError } from './errors'
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
    const { tableName } = this._dynamoConfig
    await this._client.put({ 
      TableName: tableName,
      Item: item
    })
  }

  async batchWrite (items: Array<T>) {
    const { tableName } = this._dynamoConfig
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
    const { tableName, primaryKey: { partitionKey, sortKey } } = this._dynamoConfig
    const getCommandInputKey = { [partitionKey]: partitionKeyValue }
    sortKey && sortKeyValue ? getCommandInputKey[sortKey] = sortKeyValue : {}
    const { Item: result } = await this._client.get({
      TableName: tableName,
      Key: getCommandInputKey
    })
    
    if (!result) {
      throw new NotFoundError()
    }
    const dynamoItem = Object.assign(new this._c, result)
    return dynamoItem
  }

  async queryInSortKeyRange(useGlobalSecondaryIndex: boolean, 
    partitionKeyValue: string | number, 
    sortKeyStartValue: string | number, 
    sortKeyEndValue: string | number): Promise<Array<T>> {
      const { tableName, primaryKey, secondaryKey } = this._dynamoConfig      
      const index = useGlobalSecondaryIndex ? secondaryKey : primaryKey
      if (!index) {
        throw new InvalidIndexException()
      }
      const { partitionKey, sortKey, indexName } = index
      if (!sortKey) {
        throw new InvalidSortKeyException()
      }

      const keyConditionExpression = `${partitionKey} = :partitionKeyValue AND ${sortKey} BETWEEN :sortKeyStartValue AND :sortKeyEndValue`
      const expressionAttributeValues = {
        ':partitionKeyValue': partitionKeyValue,
        ':sortKeyStartValue': sortKeyStartValue,
        ':sortKeyEndValue': sortKeyEndValue
      }
      const { Items: results } = await this._client.query({
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues
      })

      if (!results) {
        throw new NotFoundError()
      }
      const dynamoItems =  results.map(result => Object.assign(new this._c, result))
      return dynamoItems
  }
}

export { DynamoClient }
