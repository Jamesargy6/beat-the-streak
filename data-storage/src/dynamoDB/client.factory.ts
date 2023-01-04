import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

import { DynamoClient } from './client'
import { DynamoPlay } from './types'

type DynamoClientInterface = {
  writePlays(dynamoPlays: Array<DynamoPlay>)
}

const makeDynamoClient = (region: string): DynamoClientInterface => {
  const dynamoDBClient = new DynamoDBClient({ region })
  const dynamoDBDocument = DynamoDBDocument.from(dynamoDBClient)
  return new DynamoClient(dynamoDBDocument)
}

export { makeDynamoClient }
