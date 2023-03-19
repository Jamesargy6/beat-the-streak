import { DynamoClient } from '../../src/dynamoDB/client'
import { InvalidKeySchemaError, NotFoundError } from '../../src/dynamoDB/errors'
import { DynamoBaseItemType, DynamoConfig } from '../../src/dynamoDB/types'

class TestDynamoClass extends DynamoBaseItemType { 
  foo: string
}

describe('Dynamoclient', () => {
  const testTableName = 'testTableName'
  const testPartitionKey = 'testPartitionKey'
  const testSortKey = 'testSortKey'
  const testSecondaryIndexName = 'testIndexName'
  const testPartitionKey2 = 'testPartitionKey2'
  const testSortKey2 = 'testSortKey2'
  const testDynamoConfig: DynamoConfig = {
    tableName: testTableName,
    primaryKeySchema: {
      partitionKey: testPartitionKey,
      sortKey: testSortKey
    },
    secondaryKeySchemas: {
      [testPartitionKey2]: {
        indexName: testSecondaryIndexName,
        partitionKey: testPartitionKey2,
        sortKey: testSortKey2
      }
    }
  }
  
  const testItem = { foo: 'bar' }

  const testPartitionKeyValue = 'testPartitionKeyValue'
  const testSortKeyValue = 'testSortKeyValue'
  const testSortKeyStartValue = 'testSortKeyStartValue'
  const testSortKeyEndValue = 'testSortKeyEndValue'

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
  testDynamoConfig                                                                      | expectedKey
  ${testDynamoConfig}                                                                   | ${{ [testPartitionKey]: testPartitionKeyValue, [testSortKey]: testSortKeyValue }}
  ${{ tableName: testTableName, primaryKeySchema: { partitionKey: testPartitionKey } }} | ${{ [testPartitionKey]: testPartitionKeyValue }}
  
  `('read happy paths', async ({ testDynamoConfig, expectedKey }) => {
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

  test('read returns an empty item', async () => {
    const mockGet = jest.fn(() => ({ }))
    mockDynamoDBClient = {
      get: mockGet
    }
    const thing = makeThing(testDynamoConfig)
    const action = async () => await thing.read(testPartitionKeyValue, testSortKeyValue)
    expect(action).rejects.toThrowError(NotFoundError)
  })

  test.each`
  testPartitionKey      | testFilterAttributes                | expectedIndexName         | expectedKeyConditionExpression                                                                                      | expectedFilterExpression                    | expectedExpressionAttributeValues
  ${testPartitionKey}   | ${{}}                               | ${undefined}              | ${`${testPartitionKey} = :partitionKeyValue AND ${testSortKey} BETWEEN :sortKeyStartValue AND :sortKeyEndValue`}    | ${''}                                       | ${{ ':partitionKeyValue': testPartitionKeyValue, ':sortKeyStartValue': testSortKeyStartValue, ':sortKeyEndValue': testSortKeyEndValue }}
  ${testPartitionKey2}  | ${{}}                               | ${testSecondaryIndexName} | ${`${testPartitionKey2} = :partitionKeyValue AND ${testSortKey2} BETWEEN :sortKeyStartValue AND :sortKeyEndValue`}  | ${''}                                       | ${{ ':partitionKeyValue': testPartitionKeyValue, ':sortKeyStartValue': testSortKeyStartValue, ':sortKeyEndValue': testSortKeyEndValue }}
  ${testPartitionKey}   | ${{ 'foo': 'bar', 'foo2': 'bar2' }} | ${undefined}              | ${`${testPartitionKey} = :partitionKeyValue AND ${testSortKey} BETWEEN :sortKeyStartValue AND :sortKeyEndValue`}    | ${'foo = :fooValue AND foo2 = :foo2Value'}  | ${{ ':partitionKeyValue': testPartitionKeyValue, ':sortKeyStartValue': testSortKeyStartValue, ':sortKeyEndValue': testSortKeyEndValue, ':fooValue': 'bar', ':foo2Value': 'bar2' }}
  `('queryInSortKeyRange happy paths', async ({ testPartitionKey, testFilterAttributes, expectedIndexName, expectedKeyConditionExpression, expectedFilterExpression, expectedExpressionAttributeValues }) => {
    const mockQuery = jest.fn(() => ({ Items: [testItem] }))
    mockDynamoDBClient = {
      query: mockQuery
    }
    
    const thing = makeThing(testDynamoConfig)
    const result = await thing.queryInSortKeyRange(testPartitionKey, testPartitionKeyValue, testSortKeyStartValue, testSortKeyEndValue, testFilterAttributes)
    expect(mockQuery).toHaveBeenCalledWith({
      TableName: testTableName,
      IndexName: expectedIndexName,
      KeyConditionExpression: expectedKeyConditionExpression,
      FilterExpression: expectedFilterExpression,
      ExpressionAttributeValues: expectedExpressionAttributeValues
    })
    expect(result).toEqual([testItem])
  })

  test.each`
  testDynamoConfig                                                                                                                                                                                                                    | testPartitionKey
  ${{ tableName: testTableName, primaryKeySchema: { partitionKey: testPartitionKey } }}                                                                                                                                               | ${testPartitionKey}
  ${{ tableName: testTableName, primaryKeySchema: { partitionKey: testPartitionKey, sortKey: testSortKey }, secondaryKeySchemas: { [testPartitionKey2]: { indexName: testSecondaryIndexName, partitionKey: testPartitionKey2, } } }}  | ${testPartitionKey2}
  `('queryInSortRange throws error if no sortKey exists', async ({ testDynamoConfig, testPartitionKey }) =>{
    const mockQuery = jest.fn(() => ({ Items: [testItem] }))
    mockDynamoDBClient = {
      query: mockQuery
    }

    const thing = makeThing(testDynamoConfig)
    const action = async () => await thing.queryInSortKeyRange(testPartitionKey, testPartitionKeyValue, testSortKeyStartValue, testSortKeyEndValue)
    expect(action).rejects.toThrowError(InvalidKeySchemaError)
  })

  test('queryInSortRange throws error if results are empty', async () =>{
    const mockQuery = jest.fn(() => ({ }))
    mockDynamoDBClient = {
      query: mockQuery
    }
    const thing = makeThing(testDynamoConfig)
    const action = async () => await thing.queryInSortKeyRange(testSecondaryIndexName, testPartitionKeyValue, testSortKeyStartValue, testSortKeyEndValue)
    expect(action).rejects.toThrowError(NotFoundError)
  })
})


