class DynamoBaseItemType{}

class DynamoPlay extends DynamoBaseItemType {
  tx_id: string
  tx_batter_id: string
  play_index: string
}

export { DynamoBaseItemType, DynamoPlay }
