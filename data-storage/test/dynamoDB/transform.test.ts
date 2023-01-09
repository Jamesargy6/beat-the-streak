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
  const transactionId = 'testTransactionId'
  const gameIndex = '2022-04-01:1'
  const play = { batterId: 12345 }
  const ttl = 3600

  const expectedResult = [{
    tx_batter_id: `${transactionId}:${play.batterId}`,
    play_index: `${gameIndex}:000`,
    play,
    ttl
  }]

  const result = toDynamoPlays(transactionId, gameIndex, [play], ttl)
  expect(result).toEqual(expectedResult)
})

test('toDynamoGameDetail transforms input into DynamoGameDetail', () =>{
  const transactionId = 'testTransactionId'
  const gameIndex = '2022-04-01:1'
  const gameDetail = jest.fn()
  const ttl = 3600

  const expectedResult = { 
    tx_id: transactionId, 
    game_index: gameIndex, 
    game_detail: gameDetail, 
    ttl
  }

  const result = toDynamoGameDetail(transactionId, gameIndex, gameDetail, ttl)
  expect(result).toEqual(expectedResult)
})
