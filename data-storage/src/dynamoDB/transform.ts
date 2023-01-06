import { DynamoPlay } from './types'

const PLAY_NUMBER_FORMAT_LENGTH = 3

const toGameIndex = (date: string, gameNumber: number): string => {
  const gameIndex = `${date}:${gameNumber}`
  return gameIndex
}

const toPlayIndex = (gameIndex: string, playNumber: number): string => {
  const formattedPlayNumber = String(playNumber).padStart(PLAY_NUMBER_FORMAT_LENGTH, '0')
  const playIndex = `${gameIndex}:${formattedPlayNumber}`
  return playIndex
}

const toDynamoPlays = (gameIndex: string, plays: Array<{ batterId: number }>): Array<DynamoPlay> => {
  const dynamoPlays: Array<DynamoPlay> = plays.map((play, playNumber) => {
  const { batterId: batter_id } = play
  const play_index = toPlayIndex(gameIndex, playNumber)
    return { batter_id, play_index, play }
  })
  return dynamoPlays
}

export { toGameIndex, toDynamoPlays }
