class DynamoBaseItemType{
  [others: string]: string | number | object
}

class DynamoPlay extends DynamoBaseItemType {
  batterId: number
  pitcherId: number
  playIndex: string
}

class DynamoGameDetail extends DynamoBaseItemType {
  gameIndex: string
}

type KeySchema = {
  partitionKey: string,
  sortKey?: string,
  indexName?: string
}

type DynamoConfig = {
  tableName: string, 
  primaryKeySchema: KeySchema,
  secondaryKeySchemas?: {
    [partitionKey: string]: KeySchema 
  }
}

export { DynamoBaseItemType, DynamoPlay, DynamoGameDetail, DynamoConfig }
