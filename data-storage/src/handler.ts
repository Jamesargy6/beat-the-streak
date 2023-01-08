import { BTS_PLAY_TABLE_NAME } from './constants'
import { makeDynamoClient } from './dynamoDB/client.factory'
import { toGameIndex, toDynamoPlays } from './dynamoDB/transform'
import { DynamoPlay } from './dynamoDB/types'

type WritePlaysToDynamoInput = {
  transactionId: string
  date: string,
  gamePk: number,
  plays: Array<{ batterId: number }>
}
const writePlaysToDynamo = async (event: WritePlaysToDynamoInput) => {
  const dynamoClient = makeDynamoClient<DynamoPlay>(BTS_PLAY_TABLE_NAME)
  const { transactionId, date, gamePk, plays } = event
  const gameIndex = toGameIndex(date, gamePk)
  const dynamoPlays = toDynamoPlays(transactionId, gameIndex, plays)
  await dynamoClient.batchWrite(dynamoPlays)
}

export { writePlaysToDynamo }
