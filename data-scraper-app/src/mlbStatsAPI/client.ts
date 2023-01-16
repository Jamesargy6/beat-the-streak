import MLBStatsAPI from 'mlb-stats-api'
import { GameType, PlayByPlay, Schedule, SportID, BoxScore, ContextMetrics } from 'mlb-stats-api'
import { GameNotFoundError } from './errors'
class MLBStatsAPIClient {
    _client: MLBStatsAPI
    constructor (client: MLBStatsAPI) {
        this._client = client
    }

    async getRegularSeasonGames(startDate: string, endDate: string): Promise<Schedule> {
      const params = {
        sportId: SportID.MLB,
        startDate,
        endDate,
        gameType: GameType.RegularSeason
      }
      const response = await this._client.getSchedule({ params })
      return response.data
    }

    async getPlayByPlay(gamePk: number): Promise<PlayByPlay> {
      const pathParams = { gamePk }
      const response = await this._client.getGamePlayByPlay({ pathParams })
      return response.data
    }

    async getBoxScore(gamePk: number): Promise<BoxScore> {
      const pathParams = { gamePk }
      let response
      try {
        response = await this._client.getGameBoxscore({ pathParams })
      } catch (err) {
        const { status: statusCode } = err.response
        if (statusCode == 404) {
          throw new GameNotFoundError(gamePk)
        } 
        throw err
      }
      return response.data
    }

    async getContextMetrics(gamePk: number): Promise<ContextMetrics> {
      const pathParams = { gamePk }
      let response
      try {
        response = await this._client.getGameContextMetrics({ pathParams })
      } catch (err) {
        const { status: statusCode } = err.response
        if (statusCode == 404) {
          throw new GameNotFoundError(gamePk)
        } 
        throw err
      }
      return response.data
    }
}

export { MLBStatsAPIClient }
