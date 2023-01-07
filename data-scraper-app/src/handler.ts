import { toGames, toPlay, toGameDetails } from './mlbStatsAPI/transform'
import { makeMLBStatsAPIClient } from './mlbStatsAPI/client.factory'
import { Game, Play, GameDetails } from './mlbStatsAPI/types'

type GetGamesInput = { startDate: string, endDate: string }
const getGames = async ({ startDate, endDate }: GetGamesInput): Promise<Array<Game>> => {
  const mlbStatsAPIClient = makeMLBStatsAPIClient()
    const schedule = await mlbStatsAPIClient.getRegularSeasonGames(startDate, endDate)
    const games = toGames(schedule)
    return games
}

type GetPlaysInput = { gamePk: number }
const getPlays = async ({ gamePk }: GetPlaysInput): Promise<Array<Play>> => {
  const mlbStatsAPIClient = makeMLBStatsAPIClient()
  const playByPlay = await mlbStatsAPIClient.getPlayByPlay(gamePk)
  const { allPlays: allAPIPlays } = playByPlay
  const allCompleteAPIPlays = allAPIPlays.filter(play => play.about.isComplete)
  const allPlays = allCompleteAPIPlays.map(play => toPlay(play))
  return allPlays
}

type GetGameDetails = { gamePk: number }
const getGameDetails = async ({ gamePk }: GetGameDetails): Promise<GameDetails> => {
  const mlbStatsAPIClient = makeMLBStatsAPIClient()
  const boxScorePromise = mlbStatsAPIClient.getBoxScore(gamePk)
  const contextMetricsPromise = mlbStatsAPIClient.getContextMetrics(gamePk)
  const [boxScore, contextMetrics] = await Promise.all([boxScorePromise, contextMetricsPromise])
  const gameDetails = toGameDetails(boxScore, contextMetrics)
  return gameDetails
}

export { getGames, getPlays, getGameDetails }
