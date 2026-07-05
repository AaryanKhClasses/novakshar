import { BaseError } from './BaseError.js'

export class StorageError extends BaseError {
    constructor(message: string, code = "STORAGE_ERROR") {
        super(code, message)
    }
}
