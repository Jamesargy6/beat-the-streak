declare module 'mlb-stats-api' {
  export const enum SportID {
    MLB = 1
  }
  
  export const enum GameType {
    RegularSeason = 'R'
  }

  export type Game = { gamePk: number }
  export type Date = { games: Array<Game> }
  export type Schedule = { dates: Array<Date> }

  export type GetScheduleParams = {
    params: {
      sportId: number,
      startDate: string,
      endDate: string,
      gameType?: string
    }
  }
  export type GetScheduleResponse = { data: Schedule }
  
  export default class MLBStatsAPI {
     getSchedule(params: GetScheduleParams): Promise<GetScheduleResponse>
  }
}
