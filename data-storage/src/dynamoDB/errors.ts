class InvalidKeySchemaException extends Error {
  __proto__ = Error
  /* istanbul ignore next */
  constructor() {
    super()
    Object.setPrototypeOf(this, InvalidKeySchemaException.prototype)
    this.name = 'InvalidKeySchemaException'
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

export { InvalidKeySchemaException, NotFoundError }
