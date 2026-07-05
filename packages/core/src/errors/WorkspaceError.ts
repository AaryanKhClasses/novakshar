import { BaseError } from './BaseError.js'

export class WorkspaceError extends BaseError {
    constructor(message: string, code = "WORKSPACE_ERROR") {
        super(code, message)
    }
}
