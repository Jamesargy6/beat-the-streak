import { BoxScore, GameType, PlayByPlay, Schedule, SportID, BoxScoreInfoLabel } from 'mlb-stats-api'
import { MLBStatsAPIClient } from '../../src/mlbStatsAPI/client'

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
    
  let mockGetSchedule, mockGetGamePlayByPlay, mockGetGameBoxscore, mockClient
  beforeEach(() => {
    jest.resetAllMocks()
    mockGetSchedule = jest.fn(async (_) => ({ data: testSchedule }))
    mockGetGamePlayByPlay = jest.fn(async (_) => ({ data: testPlayByPlay }))
    mockGetGameBoxscore = jest.fn(async (_) => ({ data: testBoxScore }))
    mockClient = { 
      getSchedule: mockGetSchedule,
      getGamePlayByPlay: mockGetGamePlayByPlay,
      getGameBoxscore: mockGetGameBoxscore
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
  })
})
