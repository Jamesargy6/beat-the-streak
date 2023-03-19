import MLBStatsAPI, { ScheduleHydrationOptions, ScheduleFieldOptions, PlayByPlayFieldOptions } from 'mlb-stats-api'
import { GameType, PlayByPlay, Schedule, SportID } from 'mlb-stats-api'
class MLBStatsAPIClient {
    _client: MLBStatsAPI
    constructor (client: MLBStatsAPI) {
        this._client = client
    }

    async getRegularSeasonGames(startDate: string, endDate: string): Promise<Schedule> {
      const hydrationOptions = [
        ScheduleHydrationOptions.Lineups,
        ScheduleHydrationOptions.Venue,
        ScheduleHydrationOptions.Weather,
        ScheduleHydrationOptions.ProbablePitcher
      ]
      const fieldsOptions = [
        ScheduleFieldOptions.Dates,
        ScheduleFieldOptions.Date,
        ScheduleFieldOptions.Games,
        ScheduleFieldOptions.GamePk,
        ScheduleFieldOptions.OfficialDate,
        ScheduleFieldOptions.GameNumber,
        ScheduleFieldOptions.Venue,
        ScheduleFieldOptions.Id,
        ScheduleFieldOptions.Weather,
        ScheduleFieldOptions.Condition,
        ScheduleFieldOptions.Temp,
        ScheduleFieldOptions.Wind,
        ScheduleFieldOptions.Teams,
        ScheduleFieldOptions.Away,
        ScheduleFieldOptions.Home,
        ScheduleFieldOptions.ProbablePitcher,
        ScheduleFieldOptions.Lineups,
        ScheduleFieldOptions.HomePlayers,
        ScheduleFieldOptions.AwayPlayers
      ]
      const params = {
        sportId: SportID.MLB,
        startDate,
        endDate,
        gameType: GameType.RegularSeason,
        hydrate: hydrationOptions.join(','),
        fields: fieldsOptions.join(',')
      }
      const response = await this._client.getSchedule({ params })
      return response.data
    }

    async getPlayByPlay(gamePk: number): Promise<PlayByPlay> {
      const pathParams = { gamePk }
      const fieldsOptions = [
        PlayByPlayFieldOptions.AllPlays,
        PlayByPlayFieldOptions.Result,
        PlayByPlayFieldOptions.EventType,
        PlayByPlayFieldOptions.About,
        PlayByPlayFieldOptions.IsComplete,
        PlayByPlayFieldOptions.Matchup,
        PlayByPlayFieldOptions.Batter,
        PlayByPlayFieldOptions.Id,
        PlayByPlayFieldOptions.BatSide,
        PlayByPlayFieldOptions.Code,
        PlayByPlayFieldOptions.Pitcher,
        PlayByPlayFieldOptions.PitchHand
      ]
      const params = { fields: fieldsOptions.join(',') }
      const response = await this._client.getGamePlayByPlay({ pathParams, params })
      return response.data
    }
}

export { MLBStatsAPIClient }
