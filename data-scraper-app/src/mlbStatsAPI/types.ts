import { LeftRightCode, PlayEventType } from 'mlb-stats-api'

export type Play = {
  batterId: number,
  batSide: LeftRightCode,
  playResult: PlayEventType,
  pitcherId: number,
  pitchHand: LeftRightCode
}

export type Game = {
  gamePk: number,
  date: string,
  gameNumber: number
}

export type GameDetails = {
  venueId: number,
  awayBattingOrder: Array<number>,
  homeBattingOrder: Array<number>,
  weather: string,
  wind: string
}
