import { Play as APIPlay, LeftRightCode, PlayByPlay, Schedule } from 'mlb-stats-api'
import * as mlbStatsAPIClientFactory from '../src/mlbStatsAPI/client.factory'
import * as transform from '../src/mlbStatsAPI/transform'

import { getPlays, getGames } from '../src/handler'
import { Play } from '../src/mlbStatsAPI/types'

jest.mock('../src/mlbStatsAPI/client')
jest.mock('../src/mlbStatsAPI/transform')

let mockGetRegularSeasonGames, mockGetPlayByPlay, mockGetBoxScore, mockGetContextMetrics, mockMLBStatsAPIClient
beforeEach(() => {
  jest.clearAllMocks()
  mockGetRegularSeasonGames = jest.fn()
  mockGetPlayByPlay = jest.fn()
  mockGetBoxScore = jest.fn()
  mockGetContextMetrics = jest.fn()
})

describe('getGames', () => {
  const testSchedule: Schedule = { dates: [] }
  
  const testGames = [{
    gamePk: 1,
    date: '2022-04-01',
    gameNumber:  1,
    gameDetail: {
      venueId: 7,
      awayBattingOrder: [4, 5 ,6],
      awayProbablePitcher: 9,
      homeBattingOrder: [1, 2, 3],
      homeProbablePitcher: 8,
      weather: {
        condition: 'Dome',
        temp: '72',
        wind: '0mph, None'
      },
    }
  }, {
    gamePk: 2,
    date: '2022-04-01',
    gameNumber:  1,
    gameDetail: {
      venueId: 7,
      awayBattingOrder: [4, 5 ,6],
      awayProbablePitcher: 9,
      homeBattingOrder: [1, 2, 3],
      homeProbablePitcher: 8,
      weather: {
        condition: 'Dome',
        temp: '72',
        wind: '0mph, None'
      },
    }
  }]
  const mockToGames = jest.fn((_: Schedule) => testGames)

  let getGamePksFromScheduleSpy
  beforeEach(() => {
    mockGetRegularSeasonGames = jest.fn(async (_: string, __: string) => testSchedule)
    getGamePksFromScheduleSpy = jest.spyOn(transform, 'toGames').mockImplementation(mockToGames)
    mockMLBStatsAPIClient = { 
      getRegularSeasonGames: mockGetRegularSeasonGames,
      getPlayByPlay: mockGetPlayByPlay,
      getBoxScore: mockGetBoxScore,
      getContextMetrics: mockGetContextMetrics
    } 
    jest.spyOn(mlbStatsAPIClientFactory, 'makeMLBStatsAPIClient').mockImplementation(() => mockMLBStatsAPIClient)
  })

  test('wiring', async () => {
    const startDate = '2022-04-01'
    const endDate = '2022-04-01'
    const result = await getGames({ startDate, endDate })
    expect(mockMLBStatsAPIClient.getRegularSeasonGames).toHaveBeenCalledWith(startDate, endDate)
    expect(getGamePksFromScheduleSpy).toHaveBeenCalledWith(testSchedule)
    expect(result).toStrictEqual(testGames)
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
  
  const testPlay: Play = { 
    batterId: 12345,
    batSide: LeftRightCode.Right,
    playResult: 'single',
    pitcherId: 99999,
    pitchHand: LeftRightCode.Right
  }
  const mockToPlay = jest.fn((_: APIPlay) => testPlay)

  let toPlaySpy
  beforeEach(() => {
    mockGetPlayByPlay = jest.fn(async (_: number) => testPlayByPlay)
    toPlaySpy = jest.spyOn(transform, 'toPlay').mockImplementation(mockToPlay)
    mockMLBStatsAPIClient = { 
      getRegularSeasonGames: mockGetRegularSeasonGames,
      getPlayByPlay: mockGetPlayByPlay,
      getBoxScore: mockGetBoxScore,
      getContextMetrics: mockGetContextMetrics
    } 
    jest.spyOn(mlbStatsAPIClientFactory, 'makeMLBStatsAPIClient').mockImplementation(() => mockMLBStatsAPIClient)
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