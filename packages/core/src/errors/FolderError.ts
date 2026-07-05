import { BaseError } from './BaseError.js'

export class FolderError extends BaseError {
    constructor(message: string, code = "FOLDER_ERROR") {
        super(code, message)
    }
}
