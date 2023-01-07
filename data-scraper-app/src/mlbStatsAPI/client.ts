import MLBStatsAPI from 'mlb-stats-api'
import { GameType, PlayByPlay, Schedule, SportID } from 'mlb-stats-api'
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
}

export { MLBStatsAPIClient }
