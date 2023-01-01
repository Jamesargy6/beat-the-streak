import MLBStatsAPI from 'mlb-stats-api'
import { toBatterPlayMap, toGamePks, toPlay } from './mlbStatsAPI/transform'
import { MLBStatsAPIClient } from './mlbStatsAPI/client'
import { Play } from './mlbStatsAPI/types'

const mlbStatsAPI = new MLBStatsAPI()
const mlbStatsAPIClient = new MLBStatsAPIClient(mlbStatsAPI)

const getGamePks = async (): Promise<Array<number>> => {
    const year = 2022 //TODO: receive as input from event
    const schedule = await mlbStatsAPIClient.getRegularSeasonSchedule(year)
    const gamePks = toGamePks(schedule)
    return gamePks
}

const getBatterPlayMap = async (): Promise<Record<number, Play[]>> => {
  const gamePk = 662766 //TODO: receive as input from event
  const playByPlay = await mlbStatsAPIClient.getPlayByPlay(gamePk)
  const { allPlays: allAPIPlays } = playByPlay
  const allCompleteAPIPlays = allAPIPlays.filter(play => play.about.isComplete)
  const allPlays = allCompleteAPIPlays.map(play => toPlay(play))
  const playMap = toBatterPlayMap(allPlays)
  return playMap
}

export { getGamePks, getBatterPlayMap }
