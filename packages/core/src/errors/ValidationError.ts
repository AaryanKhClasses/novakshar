import { BaseError } from './BaseError'

export class ValidationError extends BaseError {
    constructor(message: string, code = "VALIDATION_ERROR") {
        super(code, message)
    }
}
