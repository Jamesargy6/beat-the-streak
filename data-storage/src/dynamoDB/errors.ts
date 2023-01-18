class InvalidIndexException extends Error {
  __proto__ = Error
  /* istanbul ignore next */
  constructor() {
    super()
    Object.setPrototypeOf(this, InvalidIndexException.prototype)
    this.name = 'InvalidIndexException'
  }
} 

class InvalidSortKeyException extends Error {
  __proto__ = Error
  /* istanbul ignore next */
  constructor() {
    super()
    Object.setPrototypeOf(this, InvalidSortKeyException.prototype)
    this.name = 'InvalidSortKeyException'
  }
} 

class NotFoundError extends Error {
  __proto__ = Error
  /* istanbul ignore next */
  constructor() {
    super()
    Object.setPrototypeOf(this, NotFoundError.prototype)
    this.name = 'NotFoundError'
  }
} 

export { InvalidIndexException, InvalidSortKeyException, NotFoundError }
