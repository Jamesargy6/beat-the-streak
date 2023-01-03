import * as dynamoDBClientFactory from '../src/dynamoDB/client.factory'
import * as transform from '../src/dynamoDB/transform'

jest.mock('../src/dynamoDB/transform')

import { writePlaysToDynamo } from '../src/handler'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('writePlaysToDynamo', () => {
  const testPlayId = '2022-04-01:1:001'
  const mockToPlayId = jest.fn(() => testPlayId)
  const mockDynamoClient = { writePlays: jest.fn() }

  let toPlayIdSpy
  beforeEach(() => {
    toPlayIdSpy = jest.spyOn(transform, 'toPlayId').mockImplementation(mockToPlayId)
    jest.spyOn(dynamoDBClientFactory, 'makeDynamoClient').mockImplementation(() => mockDynamoClient)
  })
  test('wiring', async () => {
    const input = {
      date: '2022-04-01',
      gameNumber: 1,
      playNumber: 1,
      plays: [{ playerId: 1 }]
    }
    await writePlaysToDynamo(input)
    expect(toPlayIdSpy).toHaveBeenCalledWith(input.date, input.gameNumber, input.playNumber)
    expect(mockDynamoClient.writePlays).toHaveBeenLastCalledWith(testPlayId, input.plays)
  })
})
