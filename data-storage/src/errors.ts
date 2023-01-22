class MissingPlayerKeyError extends Error {
  __proto__ = Error
  /* istanbul ignore next */
  constructor(playerKey: string) {
    super(`Player key ${playerKey} specified but not provided`)
    Object.setPrototypeOf(this, MissingPlayerKeyError.prototype)
    this.name = 'MissingPlayerKeyError'
  }
} 

export { MissingPlayerKeyError }
