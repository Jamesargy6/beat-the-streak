
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { makeDynamoClient } from '../../src/dynamoDB/client.factory'

jest.mock('@aws-sdk/client-dynamodb')
jest.mock('@aws-sdk/lib-dynamodb')

describe('makeDynamoClient', () => {
  let mockDynamoDBDocument
  beforeEach(() => {
    jest.clearAllMocks()
    mockDynamoDBDocument = jest.fn()
  })

  test('creates DynamoClient correctly', () => {
    const region = 'testRegion'
    makeDynamoClient(region)
    const fromSpy = jest.spyOn(DynamoDBDocument, 'from').mockImplementation(() => mockDynamoDBDocument)
    expect(DynamoDBClient).toHaveBeenCalledWith({ region })
    expect(fromSpy).toHaveBeenCalledTimes(1)
  })
})
