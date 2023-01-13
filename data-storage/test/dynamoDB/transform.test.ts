import { toDynamoPlays, toGameIndex, toDynamoGameDetail } from '../../src/dynamoDB/transform'

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
  const play = { batterId: 12345, pitcherId: 99999, someOtherAttr: 'foo' }

  const expectedResult = [{
    playIndex: `${gameIndex}:000`,
    ...play
  }]

  const result = toDynamoPlays(gameIndex, [play])
  expect(result).toEqual(expectedResult)
})

test('toDynamoGameDetail transforms input into DynamoGameDetail', () =>{
  const gameIndex = '2022-04-01:1'
  const gameDetail = { someOtherAttr: 'foo' }

  const expectedResult = { gameIndex, ...gameDetail }

  const result = toDynamoGameDetail(gameIndex, gameDetail)
  expect(result).toEqual(expectedResult)
})
