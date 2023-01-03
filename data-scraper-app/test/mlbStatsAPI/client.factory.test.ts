import MLBStatsAPI from 'mlb-stats-api' 
import { makeMLBStatsAPIClient } from '../../src/mlbStatsAPI/client.factory'

jest.mock('mlb-stats-api')

describe('makeMLBStatsAPIClient', () => {
  test('creates MLBStatsAPIClient correctly', () => {
    makeMLBStatsAPIClient()
    expect(MLBStatsAPI).toHaveBeenCalledWith()
  })
})
