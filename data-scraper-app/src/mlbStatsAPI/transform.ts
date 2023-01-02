
import { Play as APIPlay, Schedule } from 'mlb-stats-api'
import { Play, GameDate } from './types'

const toGameDates = (schedule: Schedule): Array<GameDate> => {
  const gameDates = schedule.dates.reduce((currentGameDates: Array<GameDate>, date) => {
          const dtGameDates = date.games.map(g => ({ gamePk: g.gamePk, date: g.officialDate }))
          currentGameDates.push(...dtGameDates)
          return currentGameDates
      },
      []
  )
  return gameDates
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

export { toGameDates, toPlay }
