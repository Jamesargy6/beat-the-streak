import { makeDynamoClient } from './dynamoDB/client.factory'
import { toGameIndex, toDynamoPlays, toDynamoGameDetail } from './dynamoDB/transform'
import { DynamoPlay, DynamoGameDetail } from './dynamoDB/types'
import { MissingPlayerKeyError } from './errors'

type WritePlaysToDynamoInput = {
  date: string,
  gamePk: number,
  plays: Array<{ batterId: number, pitcherId: number }>
}
const writePlaysToDynamo = async (event: WritePlaysToDynamoInput) => {
  const dynamoClient = makeDynamoClient(DynamoPlay)
  const { date, gamePk, plays } = event
  const gameIndex = toGameIndex(date, gamePk)

  const dynamoPlays = toDynamoPlays(gameIndex, plays)
  await dynamoClient.batchWrite(dynamoPlays)
}

type WriteGameDetailToDynamoInput = {
  date: string,
  gamePk: number,
  gameDetail: object
}
const writeGameDetailToDynamo = async (event: WriteGameDetailToDynamoInput) => {
  const dynamoClient = makeDynamoClient(DynamoGameDetail)
  const { date, gamePk, gameDetail } = event
  const gameIndex = toGameIndex(date, gamePk)

  const dynamoGameDetail = toDynamoGameDetail(gameIndex, gameDetail)
  await dynamoClient.write(dynamoGameDetail)
}

type ReadGameDetailFromDynamoInput = {
  gameIndex: string
}
const readGameDetailFromDynamo = async (event: ReadGameDetailFromDynamoInput): Promise<DynamoGameDetail | undefined> => {
  const dynamoClient = makeDynamoClient(DynamoGameDetail)
  const { gameIndex } = event
  return dynamoClient.read(gameIndex)
}

type queryPlaysFromDynamoInput = {
  playerKey: string,
  startDate: string,
  endDate: string,
  batterId?: number,
  pitcherId?: number
  batSide?: string,
  pitchHand?: string
}
const queryPlaysFromDynamo = async (event: queryPlaysFromDynamoInput): Promise<Array<DynamoPlay>> => {
  const { playerKey, startDate, endDate, batterId, pitcherId, batSide, pitchHand } = event
  const playerKeyTransformMap: { 
    [playerKey: string]: [
      number | undefined,
      string,
      number | undefined
    ] 
  } = {
    batterId:   [batterId, 'pitcherId', pitcherId],
    pitcherId:  [pitcherId, 'batterId', batterId]
  }
  const [playerKeyValue, filterPlayerKey, filterPlayerKeyValue] = playerKeyTransformMap[playerKey] || []
  
  if (!playerKeyValue) {
    throw new MissingPlayerKeyError(playerKey)
  }

  const filterAttributes = { 
    ...(batSide && { batSide }),
    ...(pitchHand && { pitchHand }),
    ...(filterPlayerKeyValue && { [filterPlayerKey]: filterPlayerKeyValue })
  }
  const gameIndexStart = toGameIndex(startDate, 0)
  const gameIndexEnd = toGameIndex(endDate, 999999)

  const dynamoClient = makeDynamoClient(DynamoPlay)
  return dynamoClient.queryInSortKeyRange(playerKey, playerKeyValue, gameIndexStart, gameIndexEnd, filterAttributes)
}

export { writePlaysToDynamo, writeGameDetailToDynamo, readGameDetailFromDynamo, queryPlaysFromDynamo }
