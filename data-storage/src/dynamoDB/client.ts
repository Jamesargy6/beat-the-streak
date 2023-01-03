import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

import { DynamoPlay } from './types'

const BTS_PLAY_TABLE_NAME = 'bts-play'

class DynamoClient {
  _client: DynamoDBDocument
  constructor(client: DynamoDBDocument) {
    this._client = client
  }

  async writePlays(playId: string, plays: Array<{ playerId: number }>) {
    const { playerId } = plays[0]
    const dynamoPlays: Array<DynamoPlay> = plays.map(play => ({ playerId, playId, play }))
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
