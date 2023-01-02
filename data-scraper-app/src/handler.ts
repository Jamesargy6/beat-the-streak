import MLBStatsAPI from 'mlb-stats-api'
import { toGameDates, toPlay } from './mlbStatsAPI/transform'
import { MLBStatsAPIClient } from './mlbStatsAPI/client'
import { GameDate, Play } from './mlbStatsAPI/types'

const mlbStatsAPI = new MLBStatsAPI()
const mlbStatsAPIClient = new MLBStatsAPIClient(mlbStatsAPI)

type GetGameDatesInput = { year: number }
const getGameDates = async ({ year }: GetGameDatesInput): Promise<Array<GameDate>> => {
    const schedule = await mlbStatsAPIClient.getRegularSeasonSchedule(year)
    const gateDates = toGameDates(schedule)
    return gateDates
}

type GetPlaysInput = { gamePk: number }
const getPlays = async ({ gamePk }: GetPlaysInput): Promise<Array<Play>> => {
  const playByPlay = await mlbStatsAPIClient.getPlayByPlay(gamePk)
  const { allPlays: allAPIPlays } = playByPlay
  const allCompleteAPIPlays = allAPIPlays.filter(play => play.about.isComplete)
  const allPlays = allCompleteAPIPlays.map(play => toPlay(play))
  return allPlays
}

export { getGameDates, getPlays }
