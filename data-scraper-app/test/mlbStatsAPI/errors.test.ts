import { GameNotFoundError } from '../../src/mlbStatsAPI/errors'

test('GameNotFoundError', () => {
  const gamePk = 12345
  const thing = new GameNotFoundError(gamePk)
  expect(thing.message).toBe(`Game "${gamePk}" was not found.`)
})
