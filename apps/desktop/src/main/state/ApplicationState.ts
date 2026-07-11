import { EditorSessionState } from '@shared/editor'

export interface ApplicationState {
    version: number
    recentWorkspaces: string[]
    lastWorkspace: string | null
    editor: EditorSessionState
    window: {
        width: number
        height: number
        maximized: boolean
    }
}

export const DefaultApplicationState: ApplicationState = {
    version: 1,
    recentWorkspaces: [],
    lastWorkspace: null,
    editor: {
        openDocuments: [],
        activeDocumentID: null
    },
    window: {
        width: 1600,
        height: 900,
        maximized: false
    }
}
