import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { AWS_REGION } from '../constants'
import { DynamoClient } from './client'
import { DynamoPlay, DynamoBaseItemType, DynamoGameDetail, DynamoConfig } from './types'

const DyanmoTypeConfigMap: Record<string, DynamoConfig>  = {
    [DynamoPlay.name]:        ['bts-play',  'batterId', 'playIndex'],
    [DynamoGameDetail.name]:  ['bts-game',  'gameIndex']
}

type DynamoClientInterface<T> = {
  batchWrite(items: Array<T>)
  write(item: T)
  read(partitionKeyValue: string | number, sortKeyValue?: string | number): Promise<T | undefined>
}

const makeDynamoClient = <T extends DynamoBaseItemType>(c: new () => T): DynamoClientInterface<T> => {
  const dynamoDBClient = new DynamoDBClient({ region: AWS_REGION })
  const dynamoDBDocument = DynamoDBDocument.from(dynamoDBClient)
  const dynamoConfig = DyanmoTypeConfigMap[c.name]
  return new DynamoClient<T>(c, dynamoDBDocument, dynamoConfig)
}

export { makeDynamoClient }
