import * as dynamoDBClientFactory from '../src/dynamoDB/client.factory'
import * as transform from '../src/dynamoDB/transform'
import { DynamoGameDetail, DynamoPlay } from '../src/dynamoDB/types'

jest.mock('../src/dynamoDB/transform')

import { writePlaysToDynamo, writeGameDetailToDynamo } from '../src/handler'

let mockBatchWrite, mockWrite, mockDynamoClient
beforeEach(() => {
  jest.clearAllMocks()
  mockBatchWrite = jest.fn()
  mockWrite = jest.fn()
})

describe('writePlaysToDynamo', () => {
  Date.now = jest.fn(() => 0)
  const testTtl = 3600

  const testGameIndex = '2022-04-01:1'
  const mockToGameIndex = jest.fn(() => testGameIndex)
  const testDynamoPlay = { tx_id: 'testTransactionId',
    tx_batter_id: 'testTransactionId:12345',
    play_index: '2022-04-01:1:000',
    play: { },
    ttl: testTtl
  }
  const mockToDynamoPlays = jest.fn(() => [testDynamoPlay])

  let toGameIndexSpy, toDynamoPlaysSpy, makeDynamoClientSpy
  beforeEach(() => {
    toGameIndexSpy = jest.spyOn(transform, 'toGameIndex').mockImplementation(mockToGameIndex)
    toDynamoPlaysSpy = jest.spyOn(transform, 'toDynamoPlays').mockImplementation(mockToDynamoPlays)
    mockDynamoClient = { 
      batchWrite: mockBatchWrite,
      write: mockWrite
    }
    makeDynamoClientSpy = jest.spyOn(dynamoDBClientFactory, 'makeDynamoClient').mockImplementation(() => mockDynamoClient)
  })
  test('wiring', async () => {
    const input = {
      transactionId: 'testTransactionId',
      date: '2022-04-01',
      gamePk: 1,
      plays: [{ batterId: 12345 }]
    }
    await writePlaysToDynamo(input)
    expect(makeDynamoClientSpy).toHaveBeenCalledWith(DynamoPlay)
    expect(toGameIndexSpy).toHaveBeenCalledWith(input.date, input.gamePk)
    expect(toDynamoPlaysSpy).toHaveBeenCalledWith(input.transactionId, testGameIndex, input.plays, testTtl)
    expect(mockDynamoClient.batchWrite).toHaveBeenLastCalledWith([testDynamoPlay])
  })
})

describe('writeGameDetailToDynamo', () => {
  Date.now = jest.fn(() => 0)
  const testTtl = 3600

  const testGameIndex = '2022-04-01:1'
  const mockToGameIndex = jest.fn(() => testGameIndex)
  const testDynamoGameDetail = { 
    tx_id: 'testTransactionId',
    game_index: '2022-04-01:1',
    game_detail: { },
    ttl: testTtl
  }
  const mockToDynamoGameDetail = jest.fn(() => testDynamoGameDetail)
  
  let toGameIndexSpy, toDynamoGameDetailSpy, makeDynamoClientSpy
  beforeEach(() => {
    toGameIndexSpy = jest.spyOn(transform, 'toGameIndex').mockImplementation(mockToGameIndex)
    toDynamoGameDetailSpy = jest.spyOn(transform, 'toDynamoGameDetail').mockImplementation(mockToDynamoGameDetail)
    mockDynamoClient = { 
      batchWrite: mockBatchWrite,
      write: mockWrite
    }
    makeDynamoClientSpy = jest.spyOn(dynamoDBClientFactory, 'makeDynamoClient').mockImplementation(() => mockDynamoClient)
  })
  test('wiring', async () => {
    const input = {
      transactionId: 'testTransactionId',
      date: '2022-04-01',
      gamePk: 1,
      gameDetail: { }
    }
    await writeGameDetailToDynamo(input)
    expect(makeDynamoClientSpy).toHaveBeenCalledWith(DynamoGameDetail)
    expect(toGameIndexSpy).toHaveBeenCalledWith(input.date, input.gamePk)
    expect(toDynamoGameDetailSpy).toHaveBeenCalledWith(input.transactionId, testGameIndex, input.gameDetail, testTtl)
    expect(mockDynamoClient.write).toHaveBeenLastCalledWith(testDynamoGameDetail)
  })
})
