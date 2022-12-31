import { MLBStatsAPIClient } from '../src/mlbStatsAPI/client'
import * as transform from '../src/mlbStatsAPI/transform'
import { Schedule } from 'mlb-stats-api'

import { getGamePksByYear } from '../src/handler'

jest.mock('../src/mlbStatsAPI/client')
jest.mock('../src/mlbStatsAPI/transform')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getGamePksByYear', () => {
  const mockSchedule: Schedule = { dates: [] }
  const mockGetRegularSeasonScheduleByYear = jest.fn(async (_: number) => mockSchedule)
  const mockGamePks = [1, 2, 3]
  const mockGetGamePksFromSchedule = jest.fn((_: Schedule) => mockGamePks)

  let getScheduleByYearSpy, getGamePksFromScheduleSpy
  beforeEach(() => {
    getScheduleByYearSpy = jest.spyOn(MLBStatsAPIClient.prototype, 'getRegularSeasonScheduleByYear').mockImplementation(mockGetRegularSeasonScheduleByYear)
    getGamePksFromScheduleSpy = jest.spyOn(transform, 'getGamePksFromSchedule').mockImplementation(mockGetGamePksFromSchedule)
  })

  test('wiring', async () => {
    const result = await getGamePksByYear()
    expect(getScheduleByYearSpy).toHaveBeenCalledWith(2022)
    expect(getGamePksFromScheduleSpy).toHaveBeenCalledWith(mockSchedule)
    expect(result).toBe(mockGamePks)
  })
})
