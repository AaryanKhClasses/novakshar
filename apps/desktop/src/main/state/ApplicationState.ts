import { EditorSessionState } from '@shared/editor'

export interface ApplicationState {
    version: number
    recentWorkspaces: string[]
    lastWorkspace: string | null
    editor: EditorSessionState
    window: {
        x: number | null
        y: number | null
        width: number
        height: number
        maximized: boolean
    }
    sync: {
        enabled: boolean
        email: string | null
        refreshToken: string | null
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
        x: null,
        y: null,
        width: 1600,
        height: 900,
        maximized: false
    },
    sync: {
        enabled: false,
        email: null,
        refreshToken: null
    }
}
