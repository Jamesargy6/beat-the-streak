import { GameType, PlayByPlay, Schedule, SportID } from 'mlb-stats-api'
import { MLBStatsAPIClient } from '../../src/mlbStatsAPI/client'

describe('MLBStatsAPIClient', () => {
  const testSchedule: Schedule = { dates: [] }
  const testPlayByPlay: PlayByPlay = { allPlays: [] }
    
  let mockGetSchedule, mockGetGamePlayByPlay, mockClient
  beforeEach(() => {
    jest.resetAllMocks()
    mockGetSchedule = jest.fn(async (_) => ({ data: testSchedule }))
    mockGetGamePlayByPlay = jest.fn(async (_) => ({ data: testPlayByPlay }))
    mockClient = { getSchedule: mockGetSchedule, getGamePlayByPlay: mockGetGamePlayByPlay }
  })

  const getThing = () => new MLBStatsAPIClient(mockClient)

  describe('getRegularSeasonScheduleByYear', () => {
    const testYear = 2022
    const expectedParams = {
      sportId: SportID.MLB,
      startDate: `${testYear}-01-01`,
      endDate: `${testYear}-12-31`,
      gameType: GameType.RegularSeason
    }
    
    test('happy path', async () => {
      const thing = getThing()
      const result = await thing.getRegularSeasonSchedule(testYear)
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
