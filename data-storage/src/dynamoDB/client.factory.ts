import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

import { DynamoClient } from './client'

type DynamoClientInterface = {
  writePlays(playId: string, plays: Array<{ playerId: number }>)
}

const makeDynamoClient = (region: string): DynamoClientInterface => {
  const dynamoDBClient = new DynamoDBClient({ region })
  const dynamoDBDocument = DynamoDBDocument.from(dynamoDBClient)
  return new DynamoClient(dynamoDBDocument)
}

export { makeDynamoClient }
