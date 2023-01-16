
import { BoxScore, Play as APIPlay, Schedule, BoxScoreInfoLabel, ContextMetrics } from 'mlb-stats-api'
import { Play, Game, GameDetail } from './types'

const toGames = (schedule: Schedule): Array<Game> => {
  const games = schedule.dates.reduce((currentGameDates: Array<Game>, date) => {
          const dtGames = date.games.map(g => ({ gamePk: g.gamePk, date: g.officialDate, gameNumber: g.gameNumber }))
          currentGameDates.push(...dtGames)
          return currentGameDates
      },
      []
  )
  return games
}

const toPlay = (play: APIPlay): Play => {
  const { result, matchup } = play
  const { batter, batSide, pitcher, pitchHand } = matchup
  return {
    batterId: batter.id,
    batSide: batSide.code,
    playResult: result.eventType,
    pitcherId: pitcher.id,
    pitchHand: pitchHand.code
  }
}

const toGameDetail = (boxscore: BoxScore, contextMetrics: ContextMetrics): GameDetail => {
  const { teams: boxScoreTeams, info } = boxscore
  const { away: boxScoreAway, home: boxScoreHome } = boxScoreTeams
  const { team: boxScoreHomeTeam, battingOrder: homeBattingOrder } = boxScoreHome
  const venueId = boxScoreHomeTeam.venue.id
  const { battingOrder: awayBattingOrder } = boxScoreAway
  const weatherInfo = info.find(item => item.label == BoxScoreInfoLabel.Weather) || { value: '' }
  const { value: weather } = weatherInfo
  const windInfo = info.find(item => item.label == BoxScoreInfoLabel.Wind) || { value: '' }
  const { value: wind } = windInfo

  const { game } = contextMetrics
  const { teams: contextMetricsTeams } = game
  const { away: contextMetricsAway, home: contextMetricsHome } = contextMetricsTeams
  const awayProbablePitcher = contextMetricsAway.probablePitcher ? contextMetricsAway.probablePitcher.id : null
  const homeProbablePitcher = contextMetricsHome.probablePitcher ? contextMetricsHome.probablePitcher.id : null
  return { 
    venueId,
    awayBattingOrder,
    awayProbablePitcher,
    homeBattingOrder,
    homeProbablePitcher,
    weather,
    wind,
  }
}

export { toGames, toPlay, toGameDetail }
