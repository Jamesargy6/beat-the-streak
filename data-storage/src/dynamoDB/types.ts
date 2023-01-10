class DynamoBaseItemType{
  [others: string]: string | number | object
}

class DynamoPlay extends DynamoBaseItemType {
  batter_id: number
  play_index: string
}

class DynamoGameDetail extends DynamoBaseItemType {
  game_index: string
}

export { DynamoBaseItemType, DynamoPlay, DynamoGameDetail }
