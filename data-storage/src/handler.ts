import { makeDynamoClient } from './dynamoDB/client.factory'
import { toGameIndex, toDynamoPlays } from './dynamoDB/transform'
import { DynamoPlay } from './dynamoDB/types'

const OneHourInSeconds = 60*60

type WritePlaysToDynamoInput = {
  transactionId: string
  date: string,
  gamePk: number,
  plays: Array<{ batterId: number }>
}
const writePlaysToDynamo = async (event: WritePlaysToDynamoInput) => {
  const dynamoClient = makeDynamoClient(DynamoPlay)
  const { transactionId, date, gamePk, plays } = event
  const gameIndex = toGameIndex(date, gamePk)

  const now = Date.now()
  const nowInSeconds = Math.floor(now/10e3)
  const ttl = nowInSeconds + OneHourInSeconds
  const dynamoPlays = toDynamoPlays(transactionId, gameIndex, plays, ttl)
  await dynamoClient.batchWrite(dynamoPlays)
}

export { writePlaysToDynamo }
