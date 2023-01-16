import { BoxScore, GameType, PlayByPlay, Schedule, SportID, BoxScoreInfoLabel, ContextMetrics } from 'mlb-stats-api'
import { MLBStatsAPIClient } from '../../src/mlbStatsAPI/client'
import { GameNotFoundError } from '../../src/mlbStatsAPI/errors'

class ErrorWithStatusCode extends Error {
  __proto__ = Error

  response: { status: number }
  constructor(status: number) {
    super('foo')
    this.response = { status }
    Object.setPrototypeOf(this, ErrorWithStatusCode.prototype)
  }
}

describe('MLBStatsAPIClient', () => {
  const testSchedule: Schedule = { dates: [] }
  const testPlayByPlay: PlayByPlay = { allPlays: [] }
  const testBoxScore: BoxScore = {
    teams: {
        away: {
            team: {
                venue: {
                    id: 5
                },
            },
            battingOrder: [664702, 642708, 608070, 614177, 640458, 644374, 680757, 595978, 665926],
           
        },
        home: {
            team: {
                venue: {
                    id: 7
                },
            },
            battingOrder: [593160, 677951, 643217, 521692, 467793, 641531, 609275, 572191, 670032]
        }
    },
    info: [
       
        {
            label: BoxScoreInfoLabel.Weather,
            value: '47 degrees, Cloudy.'
        },
        {
            label:  BoxScoreInfoLabel.Wind,
            value: '16 mph, L To R.'
        }
    ]
  }
  const testContextMetrics: ContextMetrics = {
    game: {
      teams: {
        away: {
          probablePitcher: { id: 669456 }
        },
        home: {
          probablePitcher: { id: 425844 }
        }
      }
    }
  }
    
  let mockGetSchedule, mockGetGamePlayByPlay, mockGetGameBoxscore, mockGetGameContextMetrics, mockClient
  beforeEach(() => {
    jest.resetAllMocks()
    mockGetSchedule = jest.fn(async (_) => ({ data: testSchedule }))
    mockGetGamePlayByPlay = jest.fn(async (_) => ({ data: testPlayByPlay }))
    mockGetGameBoxscore = jest.fn(async (_) => ({ data: testBoxScore }))
    mockGetGameContextMetrics = jest.fn(async (_) => ({ data: testContextMetrics }))
    mockClient = { 
      getSchedule: mockGetSchedule,
      getGamePlayByPlay: mockGetGamePlayByPlay,
      getGameBoxscore: mockGetGameBoxscore,
      getGameContextMetrics: mockGetGameContextMetrics
    }
  })

  const getThing = () => new MLBStatsAPIClient(mockClient)

  test('wiring', () => {
    const thing = getThing()
    expect(thing._client).toBe(mockClient)
  })

  describe('getRegularSeasonScheduleByYear', () => {
    const startDate = '2022-01-31'
    const endDate = '2022-12-31'
    const expectedParams = {
      sportId: SportID.MLB,
      startDate,
      endDate,
      gameType: GameType.RegularSeason
    }
    
    test('happy path', async () => {
      const thing = getThing()
      const result = await thing.getRegularSeasonGames(startDate, endDate)
      expect(mockGetSchedule).toHaveBeenCalledWith({ params: expectedParams })
      expect(result).toBe(testSchedule)
    })
  })

  describe('getPlayByPlay', () => {
    const testGamePk = 662766
    const expectedPathParams = {
      gamePk: testGamePk
    }
    
    test('happy path', async () => {
      const thing = getThing()
      const result = await thing.getPlayByPlay(testGamePk)
      expect(mockGetGamePlayByPlay).toHaveBeenCalledWith({ pathParams: expectedPathParams })
      expect(result).toBe(testPlayByPlay)
    })
  })

  describe('getBoxScore', () => {
    const testGamePk = 662766
    const expectedPathParams = {
      gamePk: testGamePk
    }
    
    test('happy path', async () => {
      const thing = getThing()
      const result = await thing.getBoxScore(testGamePk)
      expect(mockGetGameBoxscore).toHaveBeenCalledWith({ pathParams: expectedPathParams })
      expect(result).toBe(testBoxScore)
    })

    test('404 received', async () => {
      mockGetGameBoxscore = jest.fn(async (_) => { throw new ErrorWithStatusCode(404)})
      mockClient = {
        getGameBoxscore: mockGetGameBoxscore
      }      
      const thing = getThing()
      const action = async () => await thing.getBoxScore(testGamePk)
      await expect(action).rejects.toThrow(GameNotFoundError)
    })

    test('Some other error received', async () => {
      mockGetGameBoxscore = jest.fn(async (_) => { throw new ErrorWithStatusCode(500)})
      mockClient = {
        getGameBoxscore: mockGetGameBoxscore
      }      
      const thing = getThing()
      const action = async () => await thing.getBoxScore(testGamePk)
      await expect(action).rejects.toThrow(ErrorWithStatusCode)
    })
  })

  describe('getContextMetrics', () => {
    const testGamePk = 662766
    const expectedPathParams = {
      gamePk: testGamePk
    }
    
    test('happy path', async () => {
      const thing = getThing()
      const result = await thing.getContextMetrics(testGamePk)
      expect(mockGetGameContextMetrics).toHaveBeenCalledWith({ pathParams: expectedPathParams })
      expect(result).toBe(testContextMetrics)
    })

    test('404 received', async () => {
      mockGetGameContextMetrics = jest.fn(async (_) => { throw new ErrorWithStatusCode(404)})
      mockClient = {
        getGameContextMetrics: mockGetGameContextMetrics
      }      
      const thing = getThing()
      const action = async () => await thing.getContextMetrics(testGamePk)
      await expect(action).rejects.toThrow(GameNotFoundError)
    })

    test('Some other error received', async () => {
      mockGetGameContextMetrics = jest.fn(async (_) => { throw new ErrorWithStatusCode(500)})
      mockClient = {
        getGameContextMetrics: mockGetGameContextMetrics
      }      
      const thing = getThing()
      const action = async () => await thing.getContextMetrics(testGamePk)
      await expect(action).rejects.toThrow(ErrorWithStatusCode)
    })
  })
})
