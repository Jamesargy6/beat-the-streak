import MLBStatsAPI from 'mlb-stats-api'
import { MLBStatsAPIClient } from './mlbStatsAPI/client'
import { getGamePksFromSchedule } from './mlbStatsAPI/transform'

const mlbStatsAPI = new MLBStatsAPI()
const mlbStatsAPIClient = new MLBStatsAPIClient(mlbStatsAPI)

const getGamePksByYear = async (): Promise<Array<number>> => {
    const year = 2022 //TODO: receive as input from event
    const schedule = await mlbStatsAPIClient.getRegularSeasonScheduleByYear(year)
    const gamePks = getGamePksFromSchedule(schedule)
    return gamePks
}

export { getGamePksByYear }
