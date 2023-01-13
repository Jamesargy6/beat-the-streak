import { DynamoPlay, DynamoGameDetail } from './types'

const PLAY_NUMBER_FORMAT_LENGTH = 3

const toGameIndex = (date: string, gamePk: number): string => `${date}:${gamePk}`

const toPlayIndex = (gameIndex: string, playNumber: number): string => {
  const formattedPlayNumber = String(playNumber).padStart(PLAY_NUMBER_FORMAT_LENGTH, '0')
  return `${gameIndex}:${formattedPlayNumber}`
}

const toDynamoPlays = (gameIndex: string, plays: Array<{ batterId: number, pitcherId: number }>): Array<DynamoPlay> =>
  plays.map((play, playNumber) => {
  const playIndex = toPlayIndex(gameIndex, playNumber)
    return {  
      playIndex, 
      ...play 
    }
  })

const toDynamoGameDetail = (gameIndex: string, gameDetail: object): DynamoGameDetail => ({ 
  gameIndex: gameIndex, 
  ...gameDetail
})

export { toGameIndex, toDynamoPlays, toDynamoGameDetail }
