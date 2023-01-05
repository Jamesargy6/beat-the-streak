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
    const play_index = '2022-04-01:1:000'
    const player_id = 12345
    const play = { }
    const dynamoPlay = { player_id, play_index, play }
    
    const expectedBatchWriteInput = {
      RequestItems: {
        'bts_play': [{ PutRequest: { Item: { player_id, play_index, play } } }]
      }
    }

    const thing = makeThing()
    await thing.writePlays([dynamoPlay])
    expect(mockDynamoDBClient.batchWrite).toHaveBeenCalledWith(expectedBatchWriteInput)

  })
})
