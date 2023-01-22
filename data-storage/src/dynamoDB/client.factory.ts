import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { AWS_REGION } from '../constants'
import { DynamoClient } from './client'
import { DynamoPlay, DynamoBaseItemType, DynamoGameDetail, DynamoConfig } from './types'

const DyanmoTypeConfigMap: Record<string, DynamoConfig>  = {
    [DynamoPlay.name]: {
      tableName: 'bts-play',
      primaryKeySchema: {
        partitionKey: 'batterId',
        sortKey: 'playIndex'
      },
      secondaryKeySchemas: {
        pitcherId: {
          partitionKey: 'pitcherId',
          sortKey: 'playIndex',
          indexName: 'pitcherId_idx'
        }
      }
    },
    [DynamoGameDetail.name]:  {
      tableName: 'bts-game',  
      primaryKeySchema: {
        partitionKey: 'gameIndex'
      }
    }
}

type DynamoClientInterface<T> = {
  batchWrite(items: Array<T>)
  write(item: T)
  read(partitionKeyValue: string | number, sortKeyValue?: string | number): Promise<T | undefined>
  queryInSortKeyRange(partitionKey: string, 
    partitionKeyValue: string | number, 
    sortKeyStartValue: string | number, 
    sortKeyEndValue: string | number,
    filterAttributes?: { [attribute: string]: string | number }): Promise<Array<T>>
}

const makeDynamoClient = <T extends DynamoBaseItemType>(c: new () => T): DynamoClientInterface<T> => {
  const dynamoDBClient = new DynamoDBClient({ region: AWS_REGION })
  const dynamoDBDocument = DynamoDBDocument.from(dynamoDBClient)
  const dynamoConfig = DyanmoTypeConfigMap[c.name]
  return new DynamoClient<T>(c, dynamoDBDocument, dynamoConfig)
}

export { makeDynamoClient }
