import { GameType, HydrationOptions, PlayByPlay, Schedule, SportID } from 'mlb-stats-api'
import { MLBStatsAPIClient } from '../../src/mlbStatsAPI/client'

describe('MLBStatsAPIClient', () => {
  const testSchedule: Schedule = { dates: [] }
  const testPlayByPlay: PlayByPlay = { allPlays: [] }

    
  let mockGetSchedule, mockGetGamePlayByPlay, mockGetGameBoxscore, mockGetGameContextMetrics, mockClient
  beforeEach(() => {
    jest.resetAllMocks()
    mockGetSchedule = jest.fn(async (_) => ({ data: testSchedule }))
    mockGetGamePlayByPlay = jest.fn(async (_) => ({ data: testPlayByPlay }))
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
    const hydrationOptions = [
      HydrationOptions.Lineups,
      HydrationOptions.Venue,
      HydrationOptions.Weather,
      HydrationOptions.Stats,
      HydrationOptions.ProbablePitcher
    ]
    const expectedParams = {
      sportId: SportID.MLB,
      startDate,
      endDate,
      gameType: GameType.RegularSeason,
      hydrate: hydrationOptions.join(',') 
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
})
