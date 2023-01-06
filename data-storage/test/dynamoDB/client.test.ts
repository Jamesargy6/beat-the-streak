import { DynamoClient } from '../../src/dynamoDB/client'

describe('Dynamoclient', () => {
  let mockDynamoDBClient
  beforeEach(() => {
    jest.resetAllMocks()
    mockDynamoDBClient = {
      batchWrite: jest.fn()
    }
  })
  
  const makeThing = () => {
    return new DynamoClient(mockDynamoDBClient)
  }

  test('wiring', () => {
    const thing = makeThing()
    expect(thing._client).toBe(mockDynamoDBClient)
  })

  test('_batchWrite', async () => {
    const play_index = '2022-04-01:1:000'
    const batter_id = 12345
    const play = { }
    const dynamoPlay = { batter_id, play_index, play }
    
    const expectedBatchWriteInput1 = {
      RequestItems: {
        'bts-play': Array(25).fill({ PutRequest: { Item: { batter_id, play_index, play } } })
      }
    }

    const expectedBatchWriteInput2 = {
      RequestItems: {
        'bts-play': [{ PutRequest: { Item: { batter_id, play_index, play } } }]
      }
    }

    const thing = makeThing()
    await thing.writePlays(Array(26).fill(dynamoPlay))
    expect(mockDynamoDBClient.batchWrite).toHaveBeenNthCalledWith(1, expectedBatchWriteInput1)
    expect(mockDynamoDBClient.batchWrite).toHaveBeenNthCalledWith(2, expectedBatchWriteInput2)

  })

  test('writePlays', async () => {
    const play_index = '2022-04-01:1:000'
    const batter_id = 12345
    const play = { }
    const dynamoPlay = { batter_id, play_index, play }
    
    const expectedBatchWriteInput = {
      RequestItems: {
        'bts-play': [{ PutRequest: { Item: { batter_id, play_index, play } } }]
      }
    }

    const thing = makeThing()
    await thing.writePlays([dynamoPlay])
    expect(mockDynamoDBClient.batchWrite).toHaveBeenCalledWith(expectedBatchWriteInput)

  })
})
