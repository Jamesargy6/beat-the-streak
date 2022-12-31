import MLBStatsAPI from 'mlb-stats-api'

import { Schedule, GameType, SportID } from 'mlb-stats-api'

class MLBStatsAPIClient {
    private _client: MLBStatsAPI
    constructor (client: MLBStatsAPI) {
        this._client = client
    }

    async getRegularSeasonScheduleByYear (year: number): Promise<Schedule> {
      const clientParams = {
        sportId: SportID.MLB,
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`,
        gameType: GameType.RegularSeason
      }
      const response = await this._client.getSchedule({ params: clientParams })
      return response.data
    }
}

export { MLBStatsAPIClient }
