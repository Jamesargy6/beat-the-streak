import { Play as APIPlay, LeftRightCode, PlayByPlay, Schedule } from 'mlb-stats-api'
import * as mlbStatsAPIClientFactory from '../src/mlbStatsAPI/client.factory'
import * as transform from '../src/mlbStatsAPI/transform'

import { getPlays, getGames } from '../src/handler'
import { Play } from '../src/mlbStatsAPI/types'

jest.mock('../src/mlbStatsAPI/client')
jest.mock('../src/mlbStatsAPI/transform')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getGames', () => {
  const testSchedule: Schedule = { dates: [] }
  const mockGetRegularSeasonGames = jest.fn(async (_: string, __: string) => testSchedule)
  const testGames = [{ gamePk: 1, date: '2022-04-01', gameNumber: 1 }, { gamePk: 2, date: '2022-04-01', gameNumber: 1 }]
  const mockToGames = jest.fn((_: Schedule) => testGames)

  const mockMLBStatsAPIClient = { getRegularSeasonGames: mockGetRegularSeasonGames, getPlayByPlay: jest.fn() }

  let getGamePksFromScheduleSpy
  beforeEach(() => {
    jest.spyOn(mlbStatsAPIClientFactory, 'makeMLBStatsAPIClient').mockImplementation(() => mockMLBStatsAPIClient)
    getGamePksFromScheduleSpy = jest.spyOn(transform, 'toGames').mockImplementation(mockToGames)
  })

  test('wiring', async () => {
    const startDate = '2022-04-01'
    const endDate = '2022-04-01'
    const result = await getGames({ startDate, endDate })
    expect(mockMLBStatsAPIClient.getRegularSeasonGames).toHaveBeenCalledWith(startDate, endDate)
    expect(getGamePksFromScheduleSpy).toHaveBeenCalledWith(testSchedule)
    expect(result).toBe(testGames)
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

  const mockMLBStatsAPIClient = { getRegularSeasonGames: jest.fn(), getPlayByPlay: mockGetPlayByPlay }

  let toPlaySpy
  beforeEach(() => {
    jest.spyOn(mlbStatsAPIClientFactory, 'makeMLBStatsAPIClient').mockImplementation(() => mockMLBStatsAPIClient)
    toPlaySpy = jest.spyOn(transform, 'toPlay').mockImplementation(mockToPlay)
  })

  const gamePk = 662766
  test('wiring', async () => {
    const result = await getPlays({ gamePk })
    expect(mockMLBStatsAPIClient.getPlayByPlay).toHaveBeenCalledWith(662766)
    expect(toPlaySpy).toHaveBeenNthCalledWith(1, testAPIPlay)
    expect(result).toEqual([testPlay])
  })

  test('filters out incomplete plays', async () => {
    const testIncompletePlay = testAPIPlay
    testIncompletePlay.about.isComplete = false
    jest.spyOn(mlbStatsAPIClientFactory, 'makeMLBStatsAPIClient').mockImplementation(() => mockMLBStatsAPIClient)
    await getPlays({ gamePk })
    expect(toPlaySpy).not.toHaveBeenCalled()
  })
})
