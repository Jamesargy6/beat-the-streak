import { DynamoPlay } from './types'

const PLAY_NUMBER_FORMAT_LENGTH = 3

const toPlayId = (date: string, gameNumber: number, playNumber: number): string => {
  const formattedPlayNumber = String(playNumber).padStart(PLAY_NUMBER_FORMAT_LENGTH, '0')
  const playId = `${date}:${gameNumber}:${formattedPlayNumber}`
  return playId
}

const toDynamoPlays = (date: string, gameNumber: number, plays: Array<{ playerId: number }>): Array<DynamoPlay> => {
  const dynamoPlays: Array<DynamoPlay> = plays.map((play, playNumber) => {
  const { playerId } = play
  const playId = toPlayId(date, gameNumber, playNumber)
    return { playerId, playId, play }
  })
  return dynamoPlays
}

export { toPlayId, toDynamoPlays }
