declare module 'mlb-stats-api' {
  export const enum SportID {
    MLB = 1
  }
  
  export const enum GameType {
    RegularSeason = 'R'
  }

  export const enum ScheduleHydrationOptions {
    Lineups = 'lineups',
    Venue = 'venue',
    Weather = 'weather',
    Stats = 'stats',
    ProbablePitcher = 'probablePitcher'
  }
  export const enum ScheduleFieldOptions {
    Dates = 'dates',
    Date = 'date',
    Games = 'games',
    GamePk = 'gamePk',
    OfficialDate = 'officialDate',
    GameNumber = 'gameNumber',
    Venue = 'venue',
    Id = 'id',
    Weather = 'weather',
    Condition = 'condition',
    Temp = 'temp',
    Wind = 'wind',
    Teams = 'teams',
    Away = 'away',
    Home = 'home',
    ProbablePitcher = 'probablePitcher',
    Lineups = 'lineups',
    HomePlayers = 'homePlayers',
    AwayPlayers = 'awayPlayers'
  }

  export const enum PlayByPlayFieldOptions {
    AllPlays = 'allPlays',
    Result = 'result',
    EventType = 'eventType',
    About = 'about',
    IsComplete = 'isComplete',
    Matchup = 'matchup',
    Batter = 'batter',
    Id = 'id',
    BatSide = 'batSide',
    Code = 'code',
    Pitcher = 'pitcher',
    PitchHand = 'pitchHand'
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
        }
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
      hydrate?: string,
      fields?: string
    }
  }
  type GetPlayByPlayParams = {
    pathParams: { gamePk: number },
    params?: {
      fields?: string
    }
  }
  export default class MLBStatsAPI {
     getSchedule(params: GetScheduleParams): Promise<{ data: Schedule }>
     getGamePlayByPlay(params: GetPlayByPlayParams): Promise<{ data: PlayByPlay }>
  }
}
