
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { makeDynamoClient } from '../../src/dynamoDB/client.factory'
import { AWS_REGION } from '../../src/constants'
import { DynamoPlay, DynamoGameDetail } from '../../src/dynamoDB/types'

jest.mock('@aws-sdk/client-dynamodb')
jest.mock('@aws-sdk/lib-dynamodb')
jest.mock('../../src/constants', () => ({
  AWS_REGION: 'us-west-2'
}))

describe('makeDynamoClient', () => {
  let mockDynamoDBDocument
  beforeEach(() => {
    jest.clearAllMocks()
    mockDynamoDBDocument = jest.fn()
  })

  test.each`
  dynamoItemClassName   | clientConstructor
  ${'DynamoPlay'}       | ${DynamoPlay}
  ${'DynamoGameDetail'} | ${DynamoGameDetail}
  `('creates DynamoClient for $dynamoItemClassName correctly', ({ clientConstructor }) => {
    makeDynamoClient(clientConstructor)
    const fromSpy = jest.spyOn(DynamoDBDocument, 'from').mockImplementation(() => mockDynamoDBDocument)
    expect(DynamoDBClient).toHaveBeenCalledWith({ region: AWS_REGION })
    expect(fromSpy).toHaveBeenCalledTimes(1)
  })

})
