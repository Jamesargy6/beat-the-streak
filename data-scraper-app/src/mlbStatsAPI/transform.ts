
import { Play as APIPlay, Schedule, GameState } from 'mlb-stats-api'
import { Play, Game } from './types'

const toGames = (schedule: Schedule): Array<Game> => {
  const games = schedule.dates.reduce((currentGameDates: Array<Game>, date) => {
          const dtGames = date.games.map(g => ({ 
            gamePk: g.gamePk, 
            date: g.officialDate,
            gameNumber: g.gameNumber,
            gameDetail: {
              venueId: g.venue.id,
              awayBattingOrder: g.lineups.awayPlayers.map(p => p.id),
              awayProbablePitcher: g.teams.away.probablePitcher.id,
              homeBattingOrder: g.lineups.homePlayers.map(p => p.id),
              homeProbablePitcher: g.teams.home.probablePitcher.id,
              weather: g.weather
            },
            isComplete: g.status.codedGameState == GameState.Final
          }))
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

export { toGames, toPlay }
