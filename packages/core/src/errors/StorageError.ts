import { BaseError } from './BaseError'

export class StorageError extends BaseError {
    constructor(message: string, code = "STORAGE_ERROR") {
        super(code, message)
    }
}
