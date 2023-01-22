import { MissingPlayerKeyError } from '../src/errors'

test('MissingPlayerKeyError', () => {
  const playerKey = 'playerId'
  const thing = new MissingPlayerKeyError(playerKey)
  expect(thing.message).toBe(`Player key ${playerKey} specified but not provided`)
})
