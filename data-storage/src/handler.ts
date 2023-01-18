import { makeDynamoClient } from './dynamoDB/client.factory'
import { toGameIndex, toDynamoPlays, toDynamoGameDetail } from './dynamoDB/transform'
import { DynamoPlay, DynamoGameDetail } from './dynamoDB/types'
import { MissingPartitionKeyError, NonUniquePartitionKeyError } from './errors'

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

type ScanPlaysFromDynamoInput = {
  startDate: string,
  endDate: string,
  batterId?: number,
  pitcherId?: number
}
const scanPlaysFromDynamo = async (event: ScanPlaysFromDynamoInput): Promise<Array<DynamoPlay>> => {
  const dynamoClient = makeDynamoClient(DynamoPlay)
  const { startDate, endDate, batterId, pitcherId } = event
  if (batterId && pitcherId) {
    throw new NonUniquePartitionKeyError()
  }
  const partitionKeyValue = batterId ? batterId : pitcherId
  if (!partitionKeyValue) {
    throw new MissingPartitionKeyError()
  }
  const useGlobalSecondaryIndex = !!pitcherId
  const sortKeyStartValue = toGameIndex(startDate, 0)
  const sortKeyEndValue = toGameIndex(endDate, 999999)

  return dynamoClient.queryInSortKeyRange(useGlobalSecondaryIndex, partitionKeyValue, sortKeyStartValue, sortKeyEndValue)
}

export { writePlaysToDynamo, writeGameDetailToDynamo, readGameDetailFromDynamo, scanPlaysFromDynamo }
