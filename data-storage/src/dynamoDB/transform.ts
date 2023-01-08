import { DynamoPlay } from './types'

const PLAY_NUMBER_FORMAT_LENGTH = 3

const toGameIndex = (date: string, gamePk: number): string => `${date}:${gamePk}`

const toTxBatterId = (transactionId: string, batterId: number): string => `${transactionId}:${batterId}`

const toPlayIndex = (gameIndex: string, playNumber: number): string => {
  const formattedPlayNumber = String(playNumber).padStart(PLAY_NUMBER_FORMAT_LENGTH, '0')
  return `${gameIndex}:${formattedPlayNumber}`
}

const toDynamoPlays = (transactionId: string, gameIndex: string, plays: Array<{ batterId: number }>): Array<DynamoPlay> =>
  plays.map((play, playNumber) => {
  const { batterId } = play
  const play_index = toPlayIndex(gameIndex, playNumber)
    const transactionBatterId = toTxBatterId(transactionId, batterId)
    return { tx_id: transactionId, tx_batter_id: transactionBatterId, play_index, play }
  })

export { toGameIndex, toDynamoPlays }
