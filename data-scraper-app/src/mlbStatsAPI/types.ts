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

export type GameDetail = {
  venueId: number,
  awayBattingOrder: Array<number>,
  awayProbablePitcher: number | null,
  homeBattingOrder: Array<number>,
  homeProbablePitcher: number | null,
  weather: string,
  wind: string,
}
