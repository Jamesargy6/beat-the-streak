import { Play as APIPlay, LeftRightCode } from 'mlb-stats-api'
import { toBatterPlayMap, toGamePks, toPlay } from '../../src/mlbStatsAPI/transform'
import { Play } from '../../src/mlbStatsAPI/types'

describe('toGamePks', () => {
  test.each`
  schedule                                                                                              | expectedGamePks
  ${{ dates: [] }}                                                                                      | ${[]}
  ${{ dates: [{ games: [] }] }}                                                                         | ${[]}
  ${{ dates: [{ games: [{ gamePk: 1 }] }] }}                                                            | ${[1]}
  ${{ dates: [{ games: [{ gamePk: 1 }, { gamePk: 2 }] }] }}                                             | ${[1,2]}
  ${{ dates: [{ games: [{ gamePk: 1 }, { gamePk: 2 }] }, { games: [{ gamePk: 3 }, { gamePk: 4 }] }] }}  | ${[1,2,3,4]}
  `('transforms schedule to array of gamePks', ({ schedule, expectedGamePks }) => {
    const gamePks = toGamePks(schedule)
    expect(gamePks).toEqual(expectedGamePks)
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

describe('toBatterPlayMap', () => {
  const play0 = { 
    batterId: 12345,
    batSide: LeftRightCode.Right,
    playResult: 'single',
    pitcherId: 99999,
    pitchHand: LeftRightCode.Right
  }
  const play1 = { 
    batterId: 12346,
    batSide: LeftRightCode.Right,
    playResult: 'grounded_into_double_play',
    pitcherId: 99999,
    pitchHand: LeftRightCode.Right
  }
  const play2 = { 
    batterId: 12345,
    batSide: LeftRightCode.Right,
    playResult: 'double',
    pitcherId: 99998,
    pitchHand: LeftRightCode.Left
  }
  const plays: Array<Play> = [play0, play1, play2]
  const expectedPlayMap = {
    12345: [play0, play2],
    12346: [play1],
  }
  const result = toBatterPlayMap(plays)
  expect(result).toEqual(expectedPlayMap)
})
