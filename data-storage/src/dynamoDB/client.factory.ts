import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { AWS_REGION } from '../constants'
import { DynamoClient } from './client'
import { DynamoPlay, DynamoBaseItemType, DynamoGameDetail } from './types'

const DyanmoTypeConfigMap: Record<string, string>  = {
    [DynamoPlay.name]: 'bts-play',
    [DynamoGameDetail.name]: 'bts-game'
}

type DynamoClientInterface<T> = {
  batchWrite(items: Array<T>)
  write(item: T)
}

const makeDynamoClient = <T extends DynamoBaseItemType>(c: new () => T): DynamoClientInterface<T> => {
  const dynamoDBClient = new DynamoDBClient({ region: AWS_REGION })
  const dynamoDBDocument = DynamoDBDocument.from(dynamoDBClient)

  const tableName = DyanmoTypeConfigMap[c.name]
  return new DynamoClient<T>(dynamoDBDocument, tableName)
}

export { makeDynamoClient }
