
import { Play as APIPlay, Schedule } from 'mlb-stats-api'
import { Play } from './types'

const toGamePks = (schedule: Schedule): Array<number> => {
  const gamePks = schedule.dates.reduce((currentGamePks: Array<number>, date) => {
          const dateGamePks = date.games.map((game) => game.gamePk)
          currentGamePks.push(...dateGamePks)
          return currentGamePks
      },
      []
  )
  return gamePks
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

const toBatterPlayMap = (plays: Array<Play>): Record<number, Array<Play>> => {
  const playMap = plays.reduce((currentMap: Record<number, Array<Play>>, play) => {
      const { batterId } = play
      if(!currentMap[batterId]) {
        currentMap[batterId] = []
      }
      currentMap[batterId].push(play)
      return currentMap
    }, 
    {}
  )
  return playMap
}

export { toGamePks, toPlay, toBatterPlayMap }
