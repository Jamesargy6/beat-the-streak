import { getGamePksFromSchedule } from '../../src/mlbStatsAPI/transform'

describe('getGamePksFromSchedule', () => {
  test.each`
  schedule      | expectedGamePks
  ${{ dates: [] }}                                                                                            | ${[]}
  ${{ dates: [{ games: [] }] }}                                                                             | ${[]}
  ${{ dates: [{ games: [{ gamePk: 1 }] }] }}                                                              | ${[1]}
  ${{ dates: [{ games: [{ gamePk: 1 }, { gamePk: 2 }] }] }}                                               | ${[1,2]}
  ${{ dates: [{ games: [{ gamePk: 1 }, { gamePk: 2 }] }, { games: [{ gamePk: 3 }, { gamePk: 4 }] }] }}  | ${[1,2,3,4]}
  `('transforms schedule to array of gamePks', ({ schedule, expectedGamePks }) => {
    const gamePks = getGamePksFromSchedule(schedule)
    expect(gamePks).toEqual(expectedGamePks)
  })
})