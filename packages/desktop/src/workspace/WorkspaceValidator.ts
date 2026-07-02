import { Constants, IFileSystem } from '@novakshar/core'
import * as path from 'node:path'

export interface WorkspaceValidatorResult {
    readonly valid: boolean
    readonly reason?: string
}

export class WorkspaceValidator {
    constructor(private readonly fileSystem: IFileSystem) { }

    public async validate(workspacePath: string): Promise<WorkspaceValidatorResult> {
        if(!(await this.fileSystem.exists(workspacePath))) return {
            valid: false,
            reason: 'Workspace directory does not exist.'
        }

        const metadataPath = path.join(workspacePath, Constants.WorkspaceFolder)
        if(!(await this.fileSystem.exists(metadataPath))) return {
            valid: false,
            reason: 'Workspace metadata directory does not exist.'
        }

        const requiredFiles = [
            Constants.WorkspaceFile, Constants.DatabaseFile, Constants.SettingsFile, Constants.SyncFile
        ]
        for(const file of requiredFiles) {
            const exists = await this.fileSystem.exists(path.join(metadataPath, file))
            if(!exists) return {
                valid: false,
                reason: `Required file ${file} does not exist in workspace metadata directory.`
            }
        }
        return { valid: true }
    }
}
