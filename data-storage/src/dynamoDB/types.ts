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

export { DynamoBaseItemType, DynamoPlay, DynamoGameDetail }
