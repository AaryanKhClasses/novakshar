import { BaseError } from './BaseError.js'

export class ValidationError extends BaseError {
    constructor(message: string, code = "VALIDATION_ERROR") {
        super(code, message)
    }
}
