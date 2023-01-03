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

  test('writePlays', async () => {
    const playId = 'testPlayId'
    const playerId = 12345
    const play = { playerId }
    
    const expectedBatchWriteInput = {
      RequestItems: {
        'bts-play': [{ PutRequest: { Item: { playerId, playId, play } } }]
      }
    }

    const thing = makeThing()
    await thing.writePlays(playId, [play])
    expect(mockDynamoDBClient.batchWrite).toHaveBeenCalledWith(expectedBatchWriteInput)

  })
})
