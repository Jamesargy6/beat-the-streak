
import { BoxScore, Play as APIPlay, Schedule, BoxScoreInfoLabel } from 'mlb-stats-api'
import { Play, Game, GameDetails } from './types'

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

const toGameDetails = (boxscore: BoxScore): GameDetails => {
  const { teams, info } = boxscore
  const { away, home } = teams
  const { team: homeTeam, battingOrder: homeBattingOrder } = home
  const venueId = homeTeam.venue.id
  const { battingOrder: awayBattingOrder } = away
  const weatherInfo = info.find(item => item.label == BoxScoreInfoLabel.Weather) || { value: '' }
  const { value: weather } = weatherInfo
  const windInfo = info.find(item => item.label == BoxScoreInfoLabel.Wind) || { value: '' }
  const { value: wind } = windInfo
  return { venueId, awayBattingOrder, homeBattingOrder, weather, wind }
}

export { toGames, toPlay, toGameDetails }
