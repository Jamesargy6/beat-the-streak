import { DynamoPlay, DynamoGameDetail } from './types'

const GAME_PK_FORMAT_LENGTH = 6
const PLAY_NUMBER_FORMAT_LENGTH = 3

const toGameIndex = (date: string, gamePk: number): string => {
  const formattedGamePk = String(gamePk).padStart(GAME_PK_FORMAT_LENGTH, '0')
  return `${date}:${formattedGamePk}`
}

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
