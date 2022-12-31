import { Schedule, SportID, GameType } from 'mlb-stats-api'
import { MLBStatsAPIClient } from '../../src/mlbStatsAPI/client'

describe('MLBStatsAPIClient', () => {
  const mockSchedule: Schedule = { dates: [] }
    
  let mockGetSchedule, mockClient
  beforeEach(() => {
    jest.resetAllMocks()
    mockGetSchedule = jest.fn(async (_) => ({ data: mockSchedule }))
    mockClient = { getSchedule: mockGetSchedule }
  })

  const getThing = () => new MLBStatsAPIClient(mockClient)

  describe('getRegularSeasonScheduleByYear', () => {
    const testYear = 2022
    const expectedClientParams = {
      sportId: SportID.MLB,
      startDate: `${testYear}-01-01`,
      endDate: `${testYear}-12-31`,
      gameType: GameType.RegularSeason
    }
    
    test('happy path', async () => {
      const thing = getThing()
      const result = await thing.getRegularSeasonScheduleByYear(testYear)
      expect(mockGetSchedule).toHaveBeenCalledWith({ 'params': expectedClientParams })
      expect(result).toBe(mockSchedule)
    })
  })
})