declare module 'mlb-stats-api' {
  export const enum SportID {
    MLB = 1
  }
  
  export const enum GameType {
    RegularSeason = 'R'
  }

  export const enum HydrationOptions {
    Lineups = 'lineups',
    Venue = 'venue',
    Weather = 'weather',
    Stats = 'stats',
    ProbablePitcher = 'probablePitcher'
  }

  export const enum LeftRightCode {
    Left = 'L',
    Right = 'R'
  }

  export const enum GameState {
    Final = 'F'
  }

  export type Schedule = { 
    dates: Array<{ 
      games: Array<{ 
        gamePk: number, 
        officialDate: string, 
        gameNumber: number,
        venue: { id: number },
        weather: {
          condition: string,
          temp: string,
          wind: string
        },
        teams: {
          away: { probablePitcher: { id: number } },
          home: { probablePitcher: { id: number } }
        },
        lineups: {
          homePlayers: Array<{ id: number }>,
          awayPlayers: Array<{ id: number }>,
        },
        status: { codedGameState: string }
      }> 
    }> 
  }

  export type Play = {
    result: { eventType: string },
    about: { isComplete: boolean },
    matchup: {
      batter: { id: number },
      batSide: { code: LeftRightCode },
      pitcher: { id: number },
      pitchHand: { code: LeftRightCode },
    },
  }
  export type PlayByPlay = {
    allPlays: Array<Play>
  }

  type GetScheduleParams = {
    params: {
      sportId: SportID,
      startDate: string,
      endDate: string,
      gameType?: GameType,
      hydrate?: string
    }
  }
  type GetPlayByPlayParams = {
    pathParams: { gamePk: number }
  }
  export default class MLBStatsAPI {
     getSchedule(params: GetScheduleParams): Promise<{ data: Schedule }>
     getGamePlayByPlay(params: GetPlayByPlayParams): Promise<{ data: PlayByPlay }>
  }
}
