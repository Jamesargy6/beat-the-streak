import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { AWS_REGION } from '../constants'

import { DynamoClient } from './client'

type DynamoClientInterface<T> = {
  batchWrite(items: Array<T>)
}

const makeDynamoClient = <T>(tableName: string): DynamoClientInterface<T> => {
  const dynamoDBClient = new DynamoDBClient({ region: AWS_REGION })
  const dynamoDBDocument = DynamoDBDocument.from(dynamoDBClient)
  return new DynamoClient<T>(dynamoDBDocument, tableName)
}

export { makeDynamoClient }
