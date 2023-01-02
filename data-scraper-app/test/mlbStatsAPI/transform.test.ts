import { Play as APIPlay, LeftRightCode } from 'mlb-stats-api'
import { toGameDates, toPlay } from '../../src/mlbStatsAPI/transform'
import { Play } from '../../src/mlbStatsAPI/types'

describe('toGameDates', () => {
  test.each`
  schedule                                                                                              | expectedGameDates
  ${{ dates: [] }}                                                                                      | ${[]}
  ${{ dates: [{ games: [] }] }}                                                                         | ${[]}
  ${{ dates: [{ games: [{ gamePk: 1, officialDate: '2022-04-01' }] }] }}                                | ${[{ gamePk: 1, date: '2022-04-01' }]}
  ${{ dates: [{ games: [
    { gamePk: 1, officialDate: '2022-04-01'  },
    { gamePk: 2, officialDate: '2022-04-01'  }
  ] }] }}                                                                                               | ${[{ gamePk: 1, date: '2022-04-01' }, { gamePk: 2, date: '2022-04-01' }]}
  ${{ dates: [
    { games: [
      { gamePk: 1, officialDate: '2022-04-01'  },
      { gamePk: 2, officialDate: '2022-04-01'  }
    ] }, 
    { games: [
      { gamePk: 3, officialDate: '2022-04-02'  },
      { gamePk: 4, officialDate: '2022-04-02'  }
    ] 
  }] }}                                                                                                 | ${[{ gamePk: 1, date: '2022-04-01' }, { gamePk: 2, date: '2022-04-01' }, { gamePk: 3, date: '2022-04-02' }, { gamePk: 4, date: '2022-04-02' }]}
  `('transforms schedule to array of gameDates', ({ schedule, expectedGameDates }) => {
    const gateDates = toGameDates(schedule)
    expect(gateDates).toEqual(expectedGameDates)
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
