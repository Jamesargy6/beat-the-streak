import MLBStatsAPI from 'mlb-stats-api'
import { toGameDates, toPlay } from './mlbStatsAPI/transform'
import { MLBStatsAPIClient } from './mlbStatsAPI/client'
import { GameDate, Play } from './mlbStatsAPI/types'

const mlbStatsAPI = new MLBStatsAPI()
const mlbStatsAPIClient = new MLBStatsAPIClient(mlbStatsAPI)

const getGameDates = async (): Promise<Array<GameDate>> => {
    const year = 2022 //TODO: receive as input from event
    const schedule = await mlbStatsAPIClient.getRegularSeasonSchedule(year)
    const gateDates = toGameDates(schedule)
    return gateDates
}

const getPlays = async (): Promise<Array<Play>> => {
  const gamePk = 662766 //TODO: receive as input from event
  const playByPlay = await mlbStatsAPIClient.getPlayByPlay(gamePk)
  const { allPlays: allAPIPlays } = playByPlay
  const allCompleteAPIPlays = allAPIPlays.filter(play => play.about.isComplete)
  const allPlays = allCompleteAPIPlays.map(play => toPlay(play))
  return allPlays
}

export { getGameDates, getPlays }
