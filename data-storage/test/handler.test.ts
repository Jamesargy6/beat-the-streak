import * as dynamoDBClientFactory from '../src/dynamoDB/client.factory'
import * as transform from '../src/dynamoDB/transform'

jest.mock('../src/dynamoDB/transform')

import { writePlaysToDynamo } from '../src/handler'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('writePlaysToDynamo', () => {
  const testDynamoPlay = {  playerId: 12345, playId: '2022-04-01:1:000', play: { } }
  const mockToDynamoPlays = jest.fn(() => [testDynamoPlay])
  const mockDynamoClient = { writePlays: jest.fn() }

  let toDynamoPlaysSpy
  beforeEach(() => {
    toDynamoPlaysSpy = jest.spyOn(transform, 'toDynamoPlays').mockImplementation(mockToDynamoPlays)
    jest.spyOn(dynamoDBClientFactory, 'makeDynamoClient').mockImplementation(() => mockDynamoClient)
  })
  test('wiring', async () => {
    const input = {
      date: '2022-04-01',
      gameNumber: 1,
      playNumber: 0,
      plays: [{ playerId: 12345 }]
    }
    await writePlaysToDynamo(input)
    expect(toDynamoPlaysSpy).toHaveBeenCalledWith(input.date, input.gameNumber, input.plays  )
    expect(mockDynamoClient.writePlays).toHaveBeenLastCalledWith([testDynamoPlay])
  })
})
