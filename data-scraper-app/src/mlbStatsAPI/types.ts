import { LeftRightCode, PlayEventType } from 'mlb-stats-api'

export type Play = {
  batterId: number,
  batSide: LeftRightCode,
  playResult: PlayEventType,
  pitcherId: number,
  pitchHand: LeftRightCode
}
