import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

import { DynamoPlay } from './types'

const BTS_PLAY_TABLE_NAME = 'bts-play'

class DynamoClient {
  _client: DynamoDBDocument
  constructor(client: DynamoDBDocument) {
    this._client = client
  }

  async writePlays(dynamoPlays: Array<DynamoPlay>) {
    const putRequests = dynamoPlays.map(dynamoPlay => ({ PutRequest: { Item: dynamoPlay } }))
    const input = {
      RequestItems: {
        [BTS_PLAY_TABLE_NAME]: putRequests
      }
    }
    await this._client.batchWrite(input)
  }
}

export { DynamoClient }
