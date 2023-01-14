import { DynamoClient } from '../../src/dynamoDB/client'
import { DynamoBaseItemType, DynamoConfig } from '../../src/dynamoDB/types'

class TestDynamoClass extends DynamoBaseItemType { 
  foo: string
}

describe('Dynamoclient', () => {
  const testTableName = 'testTableName'
  const testPartitionKey = 'testPartitionKey'
  const testSortKey = 'testSortKey'
  const testDynamoConfig: DynamoConfig = [testTableName, testPartitionKey, testSortKey]
  
  const testItem = { foo: 'bar' }

  const testPartitionKeyValue = 'testPartitionKeyValue'
  const testSortKeyValue = 'testSortKeyValue'

  let mockDynamoDBClient
  beforeEach(() => {
    jest.resetAllMocks()
    mockDynamoDBClient = {
      batchWrite: jest.fn(),
      put: jest.fn(),
      get: jest.fn()
    }
  })
  
  const makeThing = (dynamoConfig = testDynamoConfig) => {
    return new DynamoClient(TestDynamoClass, mockDynamoDBClient, dynamoConfig)
  }

  test('wiring', () => {
    const thing = makeThing()
    expect(thing._client).toBe(mockDynamoDBClient)
    expect(thing._dynamoConfig).toBe(testDynamoConfig)
  })

  test('write', async () => {
    const testPutCommandInput = { TableName: testTableName, Item: testItem }
    const thing = makeThing()
    await thing.write(testItem)
    expect(mockDynamoDBClient.put).toHaveBeenCalledWith(testPutCommandInput)
  })

  test('batchWrite', async () => {
    const testItem = jest.fn()
    const testPutRequest = { PutRequest: { Item: testItem } }
    
    const expectedBatchWriteInput1 = {
      RequestItems: {
        [testTableName]: Array(25).fill(testPutRequest)
      }
    }
    const expectedBatchWriteInput2 = {
      RequestItems: {
        [testTableName]: [testPutRequest]
      }
    }

    const thing = makeThing()
    await thing.batchWrite(Array(26).fill(testItem))
    expect(mockDynamoDBClient.batchWrite).toHaveBeenNthCalledWith(1, expectedBatchWriteInput1)
    expect(mockDynamoDBClient.batchWrite).toHaveBeenNthCalledWith(2, expectedBatchWriteInput2)
  })

  test.each`
  testDynamoConfig                      | expectedKey
  ${testDynamoConfig}                   | ${{ [testPartitionKey]: testPartitionKeyValue, [testSortKey]: testSortKeyValue }}
  ${[testTableName, testPartitionKey]}  | ${{ [testPartitionKey]: testPartitionKeyValue }}
  
  `('read', async ({ testDynamoConfig, expectedKey }) => {
    const mockGet = jest.fn(() => ({ Item: testItem }))
    mockDynamoDBClient = {
      batchWrite: jest.fn(),
      put: jest.fn(),
      get: mockGet
    }
    
    const thing = makeThing(testDynamoConfig)
    const result = await thing.read(testPartitionKeyValue, testSortKeyValue)
    expect(mockGet).toHaveBeenCalledWith({
      TableName: testTableName,
      Key: expectedKey
    })
    expect(result).toEqual(testItem)
  })
})
