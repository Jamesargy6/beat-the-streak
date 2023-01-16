import { Play as APIPlay, LeftRightCode, BoxScoreInfoLabel } from 'mlb-stats-api'
import { toGames, toPlay, toGameDetail } from '../../src/mlbStatsAPI/transform'
import { Play } from '../../src/mlbStatsAPI/types'

describe('toGames', () => {
  test.each`
  schedule                                                                                              | expectedGameDates
  ${{ dates: [] }}                                                                                      | ${[]}
  ${{ dates: [{ games: [] }] }}                                                                         | ${[]}
  ${{ dates: [{ games: [{ gamePk: 1, officialDate: '2022-04-01', gameNumber: 1 }] }] }}                                | ${[{ gamePk: 1, date: '2022-04-01', gameNumber: 1 }]}
  ${{ dates: [{ games: [
    { gamePk: 1, officialDate: '2022-04-01', gameNumber: 1 },
    { gamePk: 2, officialDate: '2022-04-01', gameNumber: 1 }
  ] }] }}                                                                                               | ${[{ gamePk: 1, date: '2022-04-01', gameNumber: 1 }, { gamePk: 2, date: '2022-04-01', gameNumber: 1 }]}
  ${{ dates: [
    { games: [
      { gamePk: 1, officialDate: '2022-04-01', gameNumber: 1 },
      { gamePk: 2, officialDate: '2022-04-01', gameNumber: 1 }
    ] }, 
    { games: [
      { gamePk: 3, officialDate: '2022-04-02', gameNumber: 1 },
      { gamePk: 4, officialDate: '2022-04-02', gameNumber: 1 }
    ] 
  }] }}                                                                                                 | ${[{ gamePk: 1, date: '2022-04-01', gameNumber: 1 }, { gamePk: 2, date: '2022-04-01', gameNumber: 1 }, { gamePk: 3, date: '2022-04-02', gameNumber: 1 }, { gamePk: 4, date: '2022-04-02', gameNumber: 1 }]}
  `('transforms schedule to array of gameDates', ({ schedule, expectedGameDates }) => {
    const games = toGames(schedule)
    expect(games).toEqual(expectedGameDates)
  })
})

describe('toPlay', () => {
  const apiPlay: APIPlay = {
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
  const expectedPlay: Play = { 
    batterId: 12345,
    batSide: LeftRightCode.Right,
    playResult: 'single',
    pitcherId: 99999,
    pitchHand: LeftRightCode.Right
  } 
  test('APIPlay to Play', () => {
    const result = toPlay(apiPlay)
    expect(result).toEqual(expectedPlay)
  })
})

describe('toGameDetail', () => {
  let testBoxScore, expectedGameDetail, testContextMetrics
  beforeEach(() => {
    testBoxScore = {
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
    testContextMetrics = {
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
    expectedGameDetail = {
      venueId: 7,
      awayBattingOrder: [664702, 642708, 608070, 614177, 640458, 644374, 680757, 595978, 665926],
      awayProbablePitcher: 669456,
      homeBattingOrder: [593160, 677951, 643217, 521692, 467793, 641531, 609275, 572191, 670032],
      homeProbablePitcher: 425844,
      weather: '47 degrees, Cloudy.',
      wind: '16 mph, L To R.'
    }
  })
  test('BoxScore + ContextMetrics to GameDetail', () => {
    const result = toGameDetail(testBoxScore, testContextMetrics)
    expect(result).toEqual(expectedGameDetail)
  })

  test('BoxScore + ContextMetrics to GameDetail with no BoxScoreInfo', () => {
    testBoxScore.info = []
    expectedGameDetail.weather = ''
    expectedGameDetail.wind = ''
    const result = toGameDetail(testBoxScore, testContextMetrics)
    expect(result).toEqual(expectedGameDetail)
  })

  test('BoxScore + ContextMetrics to GameDetail with no pitcher probables', () => {
    delete testContextMetrics.game.teams.away.probablePitcher
    delete testContextMetrics.game.teams.home.probablePitcher
    expectedGameDetail.awayProbablePitcher = null
    expectedGameDetail.homeProbablePitcher = null
    const result = toGameDetail(testBoxScore, testContextMetrics)
    expect(result).toEqual(expectedGameDetail)
  })
})
