import { LeftRightCode } from 'mlb-stats-api'

export type Play = {
  batterId: number,
  batSide: LeftRightCode,
  playResult: string,
  pitcherId: number,
  pitchHand: LeftRightCode
}

export type Game = {
  gamePk: number,
  date: string,
  gameNumber: number,
  gameDetail: {
    venueId: number,
    awayBattingOrder: Array<number>,
    awayProbablePitcher: number | null,
    homeBattingOrder: Array<number>,
    homeProbablePitcher: number | null,
    weather: {
      condition: string,
      temp: string,
      wind: string
    }
  },
  isComplete: boolean
}
