import { DynamoPlay, DynamoGameDetail } from './types'

const PLAY_NUMBER_FORMAT_LENGTH = 3

const toGameIndex = (date: string, gamePk: number): string => `${date}:${gamePk}`

const toPlayIndex = (gameIndex: string, playNumber: number): string => {
  const formattedPlayNumber = String(playNumber).padStart(PLAY_NUMBER_FORMAT_LENGTH, '0')
  return `${gameIndex}:${formattedPlayNumber}`
}

const toDynamoPlays = (gameIndex: string, plays: Array<{ batterId: number }>): Array<DynamoPlay> =>
  plays.map((play, playNumber) => {
  const { batterId } = play
  const play_index = toPlayIndex(gameIndex, playNumber)
    return { batter_id: batterId, play_index, play }
  })

const toDynamoGameDetail = (gameIndex: string, gameDetail: object): DynamoGameDetail => ({ 
  game_index: gameIndex, 
  game_detail: gameDetail,
})

export { toGameIndex, toDynamoPlays, toDynamoGameDetail }
