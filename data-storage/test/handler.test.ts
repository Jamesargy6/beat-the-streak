import * as dynamoDBClientFactory from '../src/dynamoDB/client.factory'
import * as transform from '../src/dynamoDB/transform'
import { DynamoGameDetail, DynamoPlay } from '../src/dynamoDB/types'
import { MissingPartitionKeyError, NonUniquePartitionKeyError } from '../src/errors'

jest.mock('../src/dynamoDB/transform')

import {
  writePlaysToDynamo,
  writeGameDetailToDynamo,
  readGameDetailFromDynamo,
  queryPlaysFromDynamo
} from '../src/handler'

let mockBatchWrite, mockWrite, mockRead, mockQueryInSortKeyRange, mockDynamoClient
beforeEach(() => {
  jest.clearAllMocks()
  mockBatchWrite = jest.fn()
  mockWrite = jest.fn()
  mockRead = jest.fn()
  mockQueryInSortKeyRange = jest.fn()
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
      batchWrite: mockBatchWrite
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
      write: mockWrite
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

describe('queryPlaysFromDynamo', () => {
  const testStartDate = '2021-04-01'
  const testEndDate = '2021-06-01'
  const testBatterId = 642086
  const testPitcherId = 622554
  const testGameIndex = '2022-04-01:1'
  const testGameIndex2 = '2022-06-01:1'
  const testDynamoPlay = {
    batterId: testBatterId,
    pitcherId: testPitcherId,
    playIndex: '2022-05-29:662555'
  }
  
  let toGameIndexSpy, makeDynamoClientSpy
  beforeEach(() => {
    mockQueryInSortKeyRange = jest.fn(() => [testDynamoPlay])
    mockDynamoClient = { 
      queryInSortKeyRange: mockQueryInSortKeyRange
    }
    makeDynamoClientSpy = jest.spyOn(dynamoDBClientFactory, 'makeDynamoClient').mockImplementation(() => mockDynamoClient)
    toGameIndexSpy = jest.spyOn(transform, 'toGameIndex')
      .mockImplementationOnce(jest.fn(() => testGameIndex))
      .mockImplementationOnce(jest.fn(() => testGameIndex2))
  })

  test('wiring', async () => {
    const input = {
      startDate: testStartDate,
      endDate: testEndDate,
      batterId: testBatterId
    }
    const result = await queryPlaysFromDynamo(input)
    expect(makeDynamoClientSpy).toHaveBeenCalledWith(DynamoPlay)
    expect(toGameIndexSpy).toHaveBeenNthCalledWith(1, input.startDate, 0)
    expect(toGameIndexSpy).toHaveBeenNthCalledWith(2, input.endDate, 999999)
    expect(mockQueryInSortKeyRange).toHaveBeenCalledWith(false, testBatterId, testGameIndex, testGameIndex2)
    expect(result).toEqual([testDynamoPlay])
  })

  test('also works with pitcherId', async () => {
    const input = {
      startDate: testStartDate,
      endDate: testEndDate,
      pitcherId: testPitcherId
    }
    const result = await queryPlaysFromDynamo(input)
    expect(makeDynamoClientSpy).toHaveBeenCalledWith(DynamoPlay)
    expect(toGameIndexSpy).toHaveBeenNthCalledWith(1, input.startDate, 0)
    expect(toGameIndexSpy).toHaveBeenNthCalledWith(2, input.endDate, 999999)
    expect(mockQueryInSortKeyRange).toHaveBeenCalledWith(true, testPitcherId, testGameIndex, testGameIndex2)
    expect(result).toEqual([testDynamoPlay])
  })

  test('throws error if batterId and pitcherId are both missing', async () => {
    const input = {
      startDate: testStartDate,
      endDate: testEndDate
    }
    const action = async () => await queryPlaysFromDynamo(input)
    await expect(action).rejects.toThrowError(MissingPartitionKeyError)
  })

  test('throws error if batterId and pitcherId are both present', async () => {
    const input = {
      startDate: testStartDate,
      endDate: testEndDate,
      batterId: testBatterId,
      pitcherId: testPitcherId
    }
    const action = async () => await queryPlaysFromDynamo(input)
    await expect(action).rejects.toThrowError(NonUniquePartitionKeyError)
  })
})
