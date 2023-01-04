import { toDynamoPlays, toPlayId } from '../../src/dynamoDB/transform'

test.each`
date            | gameNumber  | playNumber  | expectedPlayId
${'2022-04-01'} | ${1}        | ${1}        | ${'2022-04-01:1:001'}
${'2022-04-01'} | ${1}        | ${16}       | ${'2022-04-01:1:016'}
${'2022-04-01'} | ${2}        | ${999}      | ${'2022-04-01:2:999'}
`('toPlayId transforms input into playId', ({ date, gameNumber, playNumber, expectedPlayId }) => {
  const result = toPlayId(date, gameNumber, playNumber)
  expect(result).toBe(expectedPlayId)
})

test('toDynamoPlays transforms input into DynamoPlay', () =>{
  const date = '2022-04-01'
  const gameNumber = 1
  const play = { playerId: 12345 }

  const expectedResult = [{
    playerId: play.playerId,
    playId: '2022-04-01:1:000',
    play
  }]

  const result = toDynamoPlays(date, gameNumber, [play])
  expect(result).toEqual(expectedResult)
})
