import MLBStatsAPI from 'mlb-stats-api'
import { PlayByPlay, Schedule, BoxScore, ContextMetrics } from 'mlb-stats-api'

import { MLBStatsAPIClient } from './client'

type MLBStatsAPIClientInterface = {
  getRegularSeasonGames(startDate: string, endDate: string): Promise<Schedule>
  getPlayByPlay(gamePk: number): Promise<PlayByPlay>
  getBoxScore(gamePk: number): Promise<BoxScore>
  getContextMetrics(gamePk: number): Promise<ContextMetrics>
}

const makeMLBStatsAPIClient = (): MLBStatsAPIClientInterface => {
  const mlbStatsAPI = new MLBStatsAPI()
  return new MLBStatsAPIClient(mlbStatsAPI)
}

export { makeMLBStatsAPIClient }
