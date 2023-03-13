import { Play as APIPlay, LeftRightCode } from 'mlb-stats-api'
import { toGames, toPlay } from '../../src/mlbStatsAPI/transform'
import { Play } from '../../src/mlbStatsAPI/types'

const makeGame = ({
  gamePk = 1,
  officialDate = '2022-04-01',
  gameNumber=  1,
  venue = { id: 7 },
  weather = {
    condition: 'Dome',
    temp: '72',
    wind: '0mph, None'
  },
  teams = {
    away: { probablePitcher: { id: 9 } },
    home: { probablePitcher: { id: 8 } }
  },
  lineups = {
    homePlayers: [{ id: 1 }, { id: 2 }, { id: 3 }],
    awayPlayers: [{ id: 4 }, { id: 5 }, { id: 6 }]
  },
} = {}) => ({
  gamePk,
  officialDate,
  gameNumber,
  venue,
  weather,
  teams,
  lineups,
})

const makeExpectedGame = ({
  gamePk = 1,
  date = '2022-04-01',
  gameNumber =  1,
  gameDetail = {
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
} = {}) => ({
  gamePk,
  date,
  gameNumber,
  gameDetail
})

describe('toGames', () => {
  test.each`
  schedule                                | expectedGameDates
  ${{ dates: [] }}                        | ${[]}
  ${{ dates: [{ games: [] }] }}           | ${[]}
  ${{ dates: [{ games: [makeGame()] }] }} | ${[makeExpectedGame()]}
  ${{ dates: [{ games: [makeGame(), makeGame({ gamePk: 2 })] }] }} | ${[makeExpectedGame(), makeExpectedGame({ gamePk: 2 })]}
  ${{ dates: [
    { games: [
      makeGame(),
      makeGame({ gamePk: 2 })
    ] }, 
    { games: [
      makeGame({ gamePk: 3, officialDate: '2022-04-02' }),
      makeGame({ gamePk: 4, officialDate: '2022-04-02' })
    ] 
  }] }} | ${[
    makeExpectedGame(), 
    makeExpectedGame({ gamePk: 2 }), 
    makeExpectedGame({ gamePk: 3, date: '2022-04-02' }),
    makeExpectedGame({ gamePk: 4, date: '2022-04-02' })
  ]}
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
