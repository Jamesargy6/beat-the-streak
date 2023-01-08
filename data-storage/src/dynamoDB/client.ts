import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { DynamoBaseItemType } from './types'

const MAX_CHUNK_SIZE = 25

class DynamoClient<T extends DynamoBaseItemType> {
  _client: DynamoDBDocument
  _tableName: string
  constructor(client: DynamoDBDocument, tableName: string) {
    this._client = client
    this._tableName = tableName
  }

  _chunkArray (arr: Array<object>, size: number): Array<Array<object>> {
    return arr.length > size
      ? [arr.slice(0, size), ...this._chunkArray(arr.slice(size), size)]
      : [arr]
  }

  async batchWrite (items: Array<T>) {
    const requests = items.map(item => ({ PutRequest: { Item: item } }))
    const requestChunks = this._chunkArray(requests, MAX_CHUNK_SIZE)
    
    const batchWriteInputs = requestChunks.map(requestChunk => ({
      RequestItems: {
        [this._tableName]: requestChunk
      }
    }))

    const batchWritePromises = batchWriteInputs.map(input => this._client.batchWrite(input))
    await Promise.all(batchWritePromises)
  }
}

export { DynamoClient }
