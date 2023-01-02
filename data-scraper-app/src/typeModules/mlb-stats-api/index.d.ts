declare module 'mlb-stats-api' {
  export const enum SportID {
    MLB = 1
  }
  
  export const enum GameType {
    RegularSeason = 'R'
  }

  const enum LeftRightCode {
    Left = 'L',
    Right = 'R'
  }

  type PlayEventType = string

  type Game = { gamePk: number, officialDate: string }
  type Date = { games: Array<Game> }
  export type Schedule = { dates: Array<Date> }
  
  type PlayResult = {
    eventType: PlayEventType
  }
  type PlayAbout = {
    isComplete: boolean
  }
  type MatchupPlayer = {
    id: number
  }
  type PlayerSide = {
    code: LeftRightCode 
  }
  type PlayMatchup = {
    batter: MatchupPlayer,
    batSide: PlayerSide,
    pitcher: MatchupPlayer,
    pitchHand: PlayerSide,

  }
  export type Play = {
    result: PlayResult,
    about: PlayAbout,
    matchup: PlayMatchup,
  }
  export type PlayByPlay = {
    allPlays: Array<Play>
  }

  export type GetScheduleParams = {
    params: {
      sportId: SportID,
      startDate: string,
      endDate: string,
      gameType?: GameType
    }
  }
  export type GetScheduleResponse = { data: Schedule }

  export type GetPlayByPlayParams = {
    pathParams: { gamePk: number }
  }
  export type GetGamePlayByPlayResponse = { data: PlayByPlay }

  export default class MLBStatsAPI {
     getSchedule(params: GetScheduleParams): Promise<GetScheduleResponse>
     getGamePlayByPlay(params: GetPlayByPlayParams): Promise<GetGamePlayByPlayResponse>
  }
}
