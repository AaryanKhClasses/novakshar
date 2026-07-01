import { BaseError } from './BaseError'

export class WorkspaceError extends BaseError {
    constructor(message: string, code = "WORKSPACE_ERROR") {
        super(code, message)
    }
}
