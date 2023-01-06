import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

import { DynamoPlay } from './types'

const BTS_PLAY_TABLE_NAME = 'bts-play'

const MAX_CHUNK_SIZE = 25

class DynamoClient {
  _client: DynamoDBDocument
  constructor(client: DynamoDBDocument) {
    this._client = client
  }

  async _batchWrite(tableName: string, items: Array<object>) {
    const chunkArray = (arr, size): Array<Array<object>> =>
      arr.length > size
        ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
        : [arr]
    
    const requests = items.map(item => ({ PutRequest: { Item: item } }))
    const requestChunks = chunkArray(requests, MAX_CHUNK_SIZE)
    
    const batchWriteInputs = requestChunks.map(requestChunk => ({
      RequestItems: {
        [tableName]: requestChunk
      }
    }))

    const batchWritePromises = batchWriteInputs.map(input => this._client.batchWrite(input))
    await Promise.all(batchWritePromises)
  }

  async writePlays(dynamoPlays: Array<DynamoPlay>) {
    await this._batchWrite(BTS_PLAY_TABLE_NAME, dynamoPlays)
  }
}

export { DynamoClient }
