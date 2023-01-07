import { BTS_PLAY_TABLE_NAME } from './constants'
import { makeDynamoClient } from './dynamoDB/client.factory'
import { toGameIndex, toDynamoPlays } from './dynamoDB/transform'
import { DynamoPlay } from './dynamoDB/types'

type WritePlaysToDynamoInput = {
  date: string,
  gameNumber: number,
  plays: Array<{ batterId: number }>
}
const writePlaysToDynamo = async (event: WritePlaysToDynamoInput) => {
  const dynamoClient = makeDynamoClient<DynamoPlay>(BTS_PLAY_TABLE_NAME)
  const { date, gameNumber, plays } = event
  const gameIndex = toGameIndex(date, gameNumber)
  const dynamoPlays = toDynamoPlays(gameIndex, plays)
  await dynamoClient.batchWrite(dynamoPlays)
}

export { writePlaysToDynamo }
