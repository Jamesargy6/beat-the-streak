import { toDynamoPlays, toGameIndex } from '../../src/dynamoDB/transform'

test.each`
date            | gameNumber  | expectedgameIndex
${'2022-04-01'} | ${1}        | ${'2022-04-01:1'}
${'2022-04-01'} | ${1}        | ${'2022-04-01:1'}
${'2022-04-01'} | ${2}        | ${'2022-04-01:2'}
`('toGameIndex transforms input into playId', ({ date, gameNumber, expectedgameIndex }) => {
  const result = toGameIndex(date, gameNumber)
  expect(result).toBe(expectedgameIndex)
})

test('toDynamoPlays transforms input into DynamoPlay', () =>{
  const gameIndex = '2022-04-01:1'
  const play = { batterId: 12345 }

  const expectedResult = [{
    batter_id: play.batterId,
    play_index: '2022-04-01:1:000',
    play
  }]

  const result = toDynamoPlays(gameIndex, [play])
  expect(result).toEqual(expectedResult)
})
