import MLBStatsAPI from 'mlb-stats-api'
import { PlayByPlay, Schedule } from 'mlb-stats-api'

import { MLBStatsAPIClient } from './client'

type MLBStatsAPIClientInterface = {
  getRegularSeasonSchedule(year: number): Promise<Schedule>
  getPlayByPlay(gamePk: number): Promise<PlayByPlay>
}

const makeMLBStatsAPIClient = (): MLBStatsAPIClientInterface => {
  const mlbStatsAPI = new MLBStatsAPI()
  return new MLBStatsAPIClient(mlbStatsAPI)
}

export { makeMLBStatsAPIClient }
