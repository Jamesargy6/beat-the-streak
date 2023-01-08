import * as dynamoDBClientFactory from '../src/dynamoDB/client.factory'
import * as transform from '../src/dynamoDB/transform'
import { DynamoPlay } from '../src/dynamoDB/types'

jest.mock('../src/dynamoDB/transform')

import { writePlaysToDynamo } from '../src/handler'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('writePlaysToDynamo', () => {
  const testGameIndex = '2022-04-01:1'
  const mockToGameIndex = jest.fn(() => testGameIndex)
  const testDynamoPlay = { tx_id: 'testTransactionId',
    tx_batter_id: 'testTransactionId:12345',
    play_index: '2022-04-01:1:000',
    play: { }
  }
  const mockToDynamoPlays = jest.fn(() => [testDynamoPlay])
  const mockDynamoClient = { 
    batchWrite: jest.fn()
  }

  let toGameIndexSpy, toDynamoPlaysSpy, makeDynamoClientSpy
  beforeEach(() => {
    toGameIndexSpy = jest.spyOn(transform, 'toGameIndex').mockImplementation(mockToGameIndex)
    toDynamoPlaysSpy = jest.spyOn(transform, 'toDynamoPlays').mockImplementation(mockToDynamoPlays)
    makeDynamoClientSpy = jest.spyOn(dynamoDBClientFactory, 'makeDynamoClient').mockImplementation(() => mockDynamoClient)
  })
  test('wiring', async () => {
    const input = {
      transactionId: 'testTransactionId',
      date: '2022-04-01',
      gamePk: 1,
      playNumber: 0,
      plays: [{ batterId: 12345 }]
    }
    await writePlaysToDynamo(input)
    expect(makeDynamoClientSpy).toHaveBeenCalledWith(DynamoPlay)
    expect(toGameIndexSpy).toHaveBeenCalledWith(input.date, input.gamePk)
    expect(toDynamoPlaysSpy).toHaveBeenCalledWith(input.transactionId, testGameIndex, input.plays  )
    expect(mockDynamoClient.batchWrite).toHaveBeenLastCalledWith([testDynamoPlay])
  })
})
