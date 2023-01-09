import { makeDynamoClient } from './dynamoDB/client.factory'
import { toGameIndex, toDynamoPlays, toDynamoGameDetail } from './dynamoDB/transform'
import { DynamoPlay, DynamoGameDetail } from './dynamoDB/types'

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
  const nowInSeconds = Math.floor(now/1e3)
  const ttl = nowInSeconds + OneHourInSeconds

  const dynamoPlays = toDynamoPlays(transactionId, gameIndex, plays, ttl)
  await dynamoClient.batchWrite(dynamoPlays)
}

type WriteGameDetailToDynamoInput = {
  transactionId: string
  date: string,
  gamePk: number,
  gameDetail: object
}
const writeGameDetailToDynamo = async (event: WriteGameDetailToDynamoInput) => {
  const dynamoClient = makeDynamoClient(DynamoGameDetail)
  const { transactionId, date, gamePk, gameDetail } = event
  const gameIndex = toGameIndex(date, gamePk)

  const now = Date.now()
  const nowInSeconds = Math.floor(now/1e3)
  const ttl = nowInSeconds + OneHourInSeconds

  const dynamoGameDetail = toDynamoGameDetail(transactionId, gameIndex, gameDetail, ttl)
  await dynamoClient.write(dynamoGameDetail)
}

export { writePlaysToDynamo, writeGameDetailToDynamo }
