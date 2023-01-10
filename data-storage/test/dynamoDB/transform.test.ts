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
  const play = { batterId: 12345 }

  const expectedResult = [{
    batter_id: play.batterId,
    play_index: `${gameIndex}:000`,
    play,
  }]

  const result = toDynamoPlays(gameIndex, [play])
  expect(result).toEqual(expectedResult)
})

test('toDynamoGameDetail transforms input into DynamoGameDetail', () =>{
  const gameIndex = '2022-04-01:1'
  const gameDetail = jest.fn()

  const expectedResult = { 
    game_index: gameIndex, 
    game_detail: gameDetail
  }

  const result = toDynamoGameDetail(gameIndex, gameDetail)
  expect(result).toEqual(expectedResult)
})
