
class GameNotFoundError extends Error {
  __proto__ = Error
  /* istanbul ignore next */
  constructor(gamePk: number) {
    super(`Game "${gamePk}" was not found.`)
    Object.setPrototypeOf(this, GameNotFoundError.prototype)
    this.name = 'GameNotFoundError'
  }
} 

export { GameNotFoundError }
