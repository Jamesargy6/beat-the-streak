class DynamoBaseItemType{}

class DynamoPlay extends DynamoBaseItemType {
  tx_batter_id: string
  play_index: string
  ttl: number
}

export { DynamoBaseItemType, DynamoPlay }
