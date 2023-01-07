import * as dynamoDBClientFactory from '../src/dynamoDB/client.factory'
import * as transform from '../src/dynamoDB/transform'

jest.mock('../src/dynamoDB/transform')

import { writePlaysToDynamo } from '../src/handler'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('writePlaysToDynamo', () => {
  const testGameIndex = '2022-04-01:1'
  const mockToGameIndex = jest.fn(() => testGameIndex)
  const testDynamoPlay = {  batter_id: 12345, play_index: '2022-04-01:1:000', play: { } }
  const mockToDynamoPlays = jest.fn(() => [testDynamoPlay])
  const mockDynamoClient = { batchWrite: jest.fn() }

  let toGameIndexSpy, toDynamoPlaysSpy
  beforeEach(() => {
    toGameIndexSpy = jest.spyOn(transform, 'toGameIndex').mockImplementation(mockToGameIndex)
    toDynamoPlaysSpy = jest.spyOn(transform, 'toDynamoPlays').mockImplementation(mockToDynamoPlays)
    jest.spyOn(dynamoDBClientFactory, 'makeDynamoClient').mockImplementation(() => mockDynamoClient)
  })
  test('wiring', async () => {
    const input = {
      date: '2022-04-01',
      gameNumber: 1,
      playNumber: 0,
      plays: [{ batterId: 12345 }]
    }
    await writePlaysToDynamo(input)
    expect(toGameIndexSpy).toHaveBeenCalledWith(input.date, input.gameNumber)
    expect(toDynamoPlaysSpy).toHaveBeenCalledWith(testGameIndex, input.plays  )
    expect(mockDynamoClient.batchWrite).toHaveBeenLastCalledWith([testDynamoPlay])
  })
})
