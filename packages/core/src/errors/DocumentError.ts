import { BaseError } from './BaseError'

export class DocumentError extends BaseError {
    constructor(message: string, code = "DOCUMENT_ERROR") {
        super(code, message)
    }
}
