class DynamoBaseItemType{
  [others: string]: string | number | object
}

class DynamoPlay extends DynamoBaseItemType {
  tx_batter_id: string
  play_index: string
  ttl: number
}

class DynamoGameDetail extends DynamoBaseItemType {
  tx_id: string
  game_index: string
  ttl: number
}

export { DynamoBaseItemType, DynamoPlay, DynamoGameDetail }
