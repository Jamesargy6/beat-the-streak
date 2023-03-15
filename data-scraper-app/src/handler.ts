import { toGames, toPlay } from './mlbStatsAPI/transform'
import { makeMLBStatsAPIClient } from './mlbStatsAPI/client.factory'
import { Game, Play } from './mlbStatsAPI/types'

type GetGamesInput = { startDate: string, endDate: string }
const getGames = async ({ startDate, endDate }: GetGamesInput): Promise<Array<Game>> => {
  const mlbStatsAPIClient = makeMLBStatsAPIClient()
    const schedule = await mlbStatsAPIClient.getRegularSeasonGames(startDate, endDate)
    const games = toGames(schedule)
    const completedGames = games.filter(game => game.isComplete)
    return completedGames
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

export { getGames, getPlays }
