export interface ApplicationState {
    version: number
    recentWorkspaces: string[]
    lastWorkspace: string | null
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
    window: {
        width: 1600,
        height: 900,
        maximized: false
    }
}
