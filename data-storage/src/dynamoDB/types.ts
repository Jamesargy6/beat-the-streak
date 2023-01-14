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

type DynamoConfig = [tableName: string, partitionKey: string, sortKey?: string];

export { DynamoBaseItemType, DynamoPlay, DynamoGameDetail, DynamoConfig }
