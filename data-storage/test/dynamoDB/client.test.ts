import { DynamoClient } from '../../src/dynamoDB/client'

describe('Dynamoclient', () => {
  const tableName = 'testTableName'

  let mockDynamoDBClient
  beforeEach(() => {
    jest.resetAllMocks()
    mockDynamoDBClient = {
      batchWrite: jest.fn()
    }
  })
  
  const makeThing = () => {
    return new DynamoClient(mockDynamoDBClient, tableName)
  }

  test('wiring', () => {
    const thing = makeThing()
    expect(thing._client).toBe(mockDynamoDBClient)
    expect(thing._tableName).toBe(tableName)
  })

  test('batchWrite', async () => {
    const testItem = jest.fn()
    const testPutRequest = { PutRequest: { Item: testItem } }
    
    const expectedBatchWriteInput1 = {
      RequestItems: {
        [tableName]: Array(25).fill(testPutRequest)
      }
    }
    const expectedBatchWriteInput2 = {
      RequestItems: {
        [tableName]: [testPutRequest]
      }
    }

    const thing = makeThing()
    await thing.batchWrite(Array(26).fill(testItem))
    expect(mockDynamoDBClient.batchWrite).toHaveBeenNthCalledWith(1, expectedBatchWriteInput1)
    expect(mockDynamoDBClient.batchWrite).toHaveBeenNthCalledWith(2, expectedBatchWriteInput2)

  })
})
