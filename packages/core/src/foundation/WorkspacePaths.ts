import { Constants } from './Constants.js'

export class WorkspacePaths {
    constructor(private readonly root: string) { }

    get metadata() { return `${this.root}/${Constants.WorkspaceFolder}` }
    get database() { return `${this.metadata}/${Constants.DatabaseFile}` }
    get settings() { return `${this.metadata}/${Constants.SettingsFile}` }
    get sync() { return `${this.metadata}/${Constants.SyncFile}` }
    get notes() { return `${this.root}/${Constants.NotesFolder}` }
    get attachments() { return `${this.root}/${Constants.AttachmentsFolder}` }
}
