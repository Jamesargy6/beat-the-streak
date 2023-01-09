import { Play as APIPlay, LeftRightCode, PlayByPlay, Schedule, BoxScore, BoxScoreInfoLabel } from 'mlb-stats-api'
import * as mlbStatsAPIClientFactory from '../src/mlbStatsAPI/client.factory'
import * as transform from '../src/mlbStatsAPI/transform'

import { getPlays, getGames, getGameDetail } from '../src/handler'
import { Play, GameDetail } from '../src/mlbStatsAPI/types'

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
  
  const testGames = [{ gamePk: 1, date: '2022-04-01', gameNumber: 1 }, { gamePk: 2, date: '2022-04-01', gameNumber: 1 }]
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

describe('getGameDetail', () => {
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
  const testContextMetrics = {
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

  const testGameDetail: GameDetail = {
    venueId: 7,
    awayBattingOrder: [664702, 642708, 608070, 614177, 640458, 644374, 680757, 595978, 665926],
    awayProbablePitcher: 669456,
    homeBattingOrder: [593160, 677951, 643217, 521692, 467793, 641531, 609275, 572191, 670032],
    homeProbablePitcher: 425844,
    weather: '47 degrees, Cloudy.',
    wind: '16 mph, L To R.'
  }
  const mockToGameDetail = jest.fn((_: BoxScore) => testGameDetail)

  let toGameDetailSpy
  beforeEach(() => {
    mockGetBoxScore = jest.fn(async (_: number) => testBoxScore)
    mockGetContextMetrics = jest.fn(async (_: number) => testContextMetrics)
    toGameDetailSpy = jest.spyOn(transform, 'toGameDetail').mockImplementation(mockToGameDetail)
    jest.spyOn(mlbStatsAPIClientFactory, 'makeMLBStatsAPIClient').mockImplementation(() => mockMLBStatsAPIClient)
    mockMLBStatsAPIClient = { 
      getRegularSeasonGames: mockGetRegularSeasonGames,
      getPlayByPlay: mockGetPlayByPlay,
      getBoxScore: mockGetBoxScore,
      getContextMetrics: mockGetContextMetrics
    } 
  })

  const gamePk = 662766
  test('wiring', async () => {
    const result = await getGameDetail({ gamePk })
    expect(mockMLBStatsAPIClient.getBoxScore).toHaveBeenCalledWith(662766)
    expect(mockMLBStatsAPIClient.getContextMetrics).toHaveBeenCalledWith(662766)
    expect(toGameDetailSpy).toHaveBeenCalledWith(testBoxScore, testContextMetrics)
    expect(result).toEqual(testGameDetail)
  })
})
