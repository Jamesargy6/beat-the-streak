import { Play as APIPlay, LeftRightCode, PlayByPlay, Schedule } from 'mlb-stats-api'
import { MLBStatsAPIClient } from '../src/mlbStatsAPI/client'
import * as transform from '../src/mlbStatsAPI/transform'

import { getPlays, getGameDates } from '../src/handler'
import { Play } from '../src/mlbStatsAPI/types'

jest.mock('../src/mlbStatsAPI/client')
jest.mock('../src/mlbStatsAPI/transform')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getGamePks', () => {
  const testSchedule: Schedule = { dates: [] }
  const mockGetRegularSeasonSchedule = jest.fn(async (_: number) => testSchedule)
  const testGameDates = [{ gamePk: 1, date: '2022-04-01' }, { gamePk: 2, date: '2022-04-01' }]
  const mockToGameDates = jest.fn((_: Schedule) => testGameDates)

  let getScheduleByYearSpy, getGamePksFromScheduleSpy
  beforeEach(() => {
    getScheduleByYearSpy = jest.spyOn(MLBStatsAPIClient.prototype, 'getRegularSeasonSchedule').mockImplementation(mockGetRegularSeasonSchedule)
    getGamePksFromScheduleSpy = jest.spyOn(transform, 'toGameDates').mockImplementation(mockToGameDates)
  })

  test('wiring', async () => {
    const year = 2022
    const result = await getGameDates({ year })
    expect(getScheduleByYearSpy).toHaveBeenCalledWith(year)
    expect(getGamePksFromScheduleSpy).toHaveBeenCalledWith(testSchedule)
    expect(result).toBe(testGameDates)
  })
})

describe('getPlays', () => {
  const testAPIPlay: APIPlay = {
    result: {
      eventType: 'single',
    },
    about: {
      isComplete: true
    },
    matchup: {
      batter: {
        id: 12345
      },
      batSide: {
        code: LeftRightCode.Right, 
      },
      pitcher: {
        id: 99999
      },
      pitchHand: {
        code: LeftRightCode.Right, 
      }
    }
  }
  const testPlayByPlay: PlayByPlay = { allPlays: [testAPIPlay] }
  const mockGetPlayByPlay = jest.fn(async (_: number) => testPlayByPlay)
  const testPlay: Play = { 
    batterId: 12345,
    batSide: LeftRightCode.Right,
    playResult: 'single',
    pitcherId: 99999,
    pitchHand: LeftRightCode.Right
  }
  const mockToPlay = jest.fn((_: APIPlay) => testPlay)

  let getPlayByPlaySpy, toPlaySpy
  beforeEach(() => {
    getPlayByPlaySpy = jest.spyOn(MLBStatsAPIClient.prototype, 'getPlayByPlay').mockImplementation(mockGetPlayByPlay)
    toPlaySpy = jest.spyOn(transform, 'toPlay').mockImplementation(mockToPlay)
  })

  const gamePk = 662766
  test('wiring', async () => {
    const result = await getPlays({ gamePk })
    expect(getPlayByPlaySpy).toHaveBeenCalledWith(662766)
    expect(toPlaySpy).toHaveBeenNthCalledWith(1, testAPIPlay)
    expect(result).toEqual([testPlay])
  })

  test('filters out incomplete plays', async () => {
    const testIncompletePlay = testAPIPlay
    testIncompletePlay.about.isComplete = false
    jest.spyOn(MLBStatsAPIClient.prototype, 'getPlayByPlay').mockImplementation(async (_: number) => ({ allPlays: [testIncompletePlay] }))
    await getPlays({ gamePk })
    expect(toPlaySpy).not.toHaveBeenCalled()
  })
})
