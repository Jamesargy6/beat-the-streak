class InvalidKeySchemaError extends Error {
  __proto__ = Error
  /* istanbul ignore next */
  constructor() {
    super()
    Object.setPrototypeOf(this, InvalidKeySchemaError.prototype)
    this.name = 'InvalidKeySchemaError'
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

export { InvalidKeySchemaError, NotFoundError }
