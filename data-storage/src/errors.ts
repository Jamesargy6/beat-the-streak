class MissingPartitionKeyError extends Error {
  __proto__ = Error
  /* istanbul ignore next */
  constructor() {
    super()
    Object.setPrototypeOf(this, MissingPartitionKeyError.prototype)
    this.name = 'MissingPartitionKeyError'
  }
} 

class NonUniquePartitionKeyError extends Error {
  __proto__ = Error
  /* istanbul ignore next */
  constructor() {
    super()
    Object.setPrototypeOf(this, NonUniquePartitionKeyError.prototype)
    this.name = 'NonUniquePartitionKeyError'
  }
} 

export { MissingPartitionKeyError, NonUniquePartitionKeyError }
