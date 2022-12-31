
import { Schedule } from 'mlb-stats-api'

const getGamePksFromSchedule = (schedule: Schedule): Array<number> => {
  const gamePks = schedule.dates.reduce((currentGamePks: Array<number>, date) => {
          const dateGamePks = date.games.map((game) => game.gamePk)
          currentGamePks.push(...dateGamePks)
          return currentGamePks
      },
      []
  )
  return gamePks
}

export { getGamePksFromSchedule }
