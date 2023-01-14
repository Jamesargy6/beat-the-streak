import * as dynamoDBClientFactory from '../src/dynamoDB/client.factory'
import * as transform from '../src/dynamoDB/transform'
import { DynamoGameDetail, DynamoPlay } from '../src/dynamoDB/types'

jest.mock('../src/dynamoDB/transform')

import { writePlaysToDynamo, writeGameDetailToDynamo, readGameDetailFromDynamo } from '../src/handler'

let mockBatchWrite, mockWrite, mockRead, mockDynamoClient
beforeEach(() => {
  jest.clearAllMocks()
  mockBatchWrite = jest.fn()
  mockWrite = jest.fn()
  mockRead = jest.fn()
})

describe('writePlaysToDynamo', () => {

  const testGameIndex = '2022-04-01:1'
  const mockToGameIndex = jest.fn(() => testGameIndex)
  const testDynamoPlay = {
    batterId: 12345,
    pitcherId: 99999,
    playIndex: '2022-04-01:1:000',
    play: { }
  }
  const mockToDynamoPlays = jest.fn(() => [testDynamoPlay])

  let toGameIndexSpy, toDynamoPlaysSpy, makeDynamoClientSpy
  beforeEach(() => {
    toGameIndexSpy = jest.spyOn(transform, 'toGameIndex').mockImplementation(mockToGameIndex)
    toDynamoPlaysSpy = jest.spyOn(transform, 'toDynamoPlays').mockImplementation(mockToDynamoPlays)
    mockDynamoClient = { 
      batchWrite: mockBatchWrite,
      write: mockWrite,
      read: mockRead
    }
    makeDynamoClientSpy = jest.spyOn(dynamoDBClientFactory, 'makeDynamoClient').mockImplementation(() => mockDynamoClient)
  })
  test('wiring', async () => {
    const input = {
      date: '2022-04-01',
      gamePk: 1,
      plays: [{ batterId: 12345, pitcherId: 99999, }]
    }
    await writePlaysToDynamo(input)
    expect(makeDynamoClientSpy).toHaveBeenCalledWith(DynamoPlay)
    expect(toGameIndexSpy).toHaveBeenCalledWith(input.date, input.gamePk)
    expect(toDynamoPlaysSpy).toHaveBeenCalledWith(testGameIndex, input.plays)
    expect(mockDynamoClient.batchWrite).toHaveBeenLastCalledWith([testDynamoPlay])
  })
})

describe('writeGameDetailToDynamo', () => {

  const testGameIndex = '2022-04-01:1'
  const mockToGameIndex = jest.fn(() => testGameIndex)
  const testDynamoGameDetail = {
    gameIndex: '2022-04-01:1'
  }
  const mockToDynamoGameDetail = jest.fn(() => testDynamoGameDetail)
  
  let toGameIndexSpy, toDynamoGameDetailSpy, makeDynamoClientSpy
  beforeEach(() => {
    toGameIndexSpy = jest.spyOn(transform, 'toGameIndex').mockImplementation(mockToGameIndex)
    toDynamoGameDetailSpy = jest.spyOn(transform, 'toDynamoGameDetail').mockImplementation(mockToDynamoGameDetail)
    mockDynamoClient = { 
      batchWrite: mockBatchWrite,
      write: mockWrite,
      read: mockRead
    }
    makeDynamoClientSpy = jest.spyOn(dynamoDBClientFactory, 'makeDynamoClient').mockImplementation(() => mockDynamoClient)
  })
  test('wiring', async () => {
    const input = {
      date: '2022-04-01',
      gamePk: 1,
      gameDetail: { }
    }
    await writeGameDetailToDynamo(input)
    expect(makeDynamoClientSpy).toHaveBeenCalledWith(DynamoGameDetail)
    expect(toGameIndexSpy).toHaveBeenCalledWith(input.date, input.gamePk)
    expect(toDynamoGameDetailSpy).toHaveBeenCalledWith(testGameIndex, input.gameDetail)
    expect(mockDynamoClient.write).toHaveBeenLastCalledWith(testDynamoGameDetail)
  })
})

describe('readGameDetailFromDynamo', () => {

  const testGameIndex = '2022-04-01:1'
  const testDynamoGameDetail = {
    gameIndex: testGameIndex,
    someOtherAttr: 'foo'
  }
  
  let makeDynamoClientSpy
  beforeEach(() => {
    mockRead = jest.fn(() => testDynamoGameDetail)
    mockDynamoClient = { 
      batchWrite: mockBatchWrite,
      write: mockWrite,
      read: mockRead
    }
    makeDynamoClientSpy = jest.spyOn(dynamoDBClientFactory, 'makeDynamoClient').mockImplementation(() => mockDynamoClient)
  })
  test('wiring', async () => {
    const input = {
      gameIndex: testGameIndex
    }
    const result = await readGameDetailFromDynamo(input)
    expect(makeDynamoClientSpy).toHaveBeenCalledWith(DynamoGameDetail)
    expect(mockRead).toHaveBeenCalledWith(testGameIndex)
    expect(result).toEqual(testDynamoGameDetail)
  })
})
