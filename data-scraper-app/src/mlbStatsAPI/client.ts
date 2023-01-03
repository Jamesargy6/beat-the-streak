import MLBStatsAPI from 'mlb-stats-api'
import { GameType, PlayByPlay, Schedule, SportID } from 'mlb-stats-api'
class MLBStatsAPIClient {
    _client: MLBStatsAPI
    constructor (client: MLBStatsAPI) {
        this._client = client
    }

    async getRegularSeasonSchedule(year: number): Promise<Schedule> {
      const params = {
        sportId: SportID.MLB,
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`,
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
}

export { MLBStatsAPIClient }
