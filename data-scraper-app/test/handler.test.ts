import { Play as APIPlay, LeftRightCode, PlayByPlay, Schedule } from 'mlb-stats-api'
import { MLBStatsAPIClient } from '../src/mlbStatsAPI/client'
import * as transform from '../src/mlbStatsAPI/transform'

import { getBatterPlayMap, getGamePks } from '../src/handler'
import { Play } from '../src/mlbStatsAPI/types'

jest.mock('../src/mlbStatsAPI/client')
jest.mock('../src/mlbStatsAPI/transform')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getGamePks', () => {
  const testSchedule: Schedule = { dates: [] }
  const mockGetRegularSeasonSchedule = jest.fn(async (_: number) => testSchedule)
  const testGamePks = [1, 2, 3]
  const mockToGamePks = jest.fn((_: Schedule) => testGamePks)

  let getScheduleByYearSpy, getGamePksFromScheduleSpy
  beforeEach(() => {
    getScheduleByYearSpy = jest.spyOn(MLBStatsAPIClient.prototype, 'getRegularSeasonSchedule').mockImplementation(mockGetRegularSeasonSchedule)
    getGamePksFromScheduleSpy = jest.spyOn(transform, 'toGamePks').mockImplementation(mockToGamePks)
  })

  test('wiring', async () => {
    const result = await getGamePks()
    expect(getScheduleByYearSpy).toHaveBeenCalledWith(2022)
    expect(getGamePksFromScheduleSpy).toHaveBeenCalledWith(testSchedule)
    expect(result).toBe(testGamePks)
  })
})

describe('getPlaysForGame', () => {
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
  const testPlayMap: Record<number, Play[]> = { 12345: [testPlay] }
  const mockToBatterPlayMap = jest.fn((_: Play[]) => testPlayMap)

  let getPlayByPlaySpy, flattenPlaySpy, getPlayMapSpy
  beforeEach(() => {
    getPlayByPlaySpy = jest.spyOn(MLBStatsAPIClient.prototype, 'getPlayByPlay').mockImplementation(mockGetPlayByPlay)
    flattenPlaySpy = jest.spyOn(transform, 'toPlay').mockImplementation(mockToPlay)
    getPlayMapSpy = jest.spyOn(transform, 'toBatterPlayMap').mockImplementation(mockToBatterPlayMap)
  })

  test('wiring', async () => {
    const result = await getBatterPlayMap()
    expect(getPlayByPlaySpy).toHaveBeenCalledWith(662766)
    expect(flattenPlaySpy).toHaveBeenNthCalledWith(1, testAPIPlay)
    expect(getPlayMapSpy).toHaveBeenCalledWith([testPlay])
    expect(result).toBe(testPlayMap)
  })

  test('filters out incomplete plays', async () => {
    const testIncompletePlay = testAPIPlay
    testIncompletePlay.about.isComplete = false
    jest.spyOn(MLBStatsAPIClient.prototype, 'getPlayByPlay').mockImplementation(async (_: number) => ({ allPlays: [testIncompletePlay] }))
    await getBatterPlayMap()
    expect(flattenPlaySpy).not.toHaveBeenCalled()
  })
})
