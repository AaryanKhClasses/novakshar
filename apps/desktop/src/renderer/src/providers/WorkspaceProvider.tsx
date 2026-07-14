import { WorkspaceInfo } from '@shared/workspace'
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react'

export interface WorkspaceContextValue {
    isOpen: boolean
    workspaceName: string | null
    workspacePath: string | null
    recentWorkspaces: WorkspaceInfo[]
    createWorkspace: () => Promise<void>
    openWorkspace: () => Promise<void>
    closeWorkspace: () => Promise<void>
    openRecentWorkspace: (path: string) => Promise<void>
    removeRecentWorkspace: (path: string) => Promise<void>
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: PropsWithChildren) {
    const [workspaceName, setWorkspaceName] = useState<string | null>(null)
    const [workspacePath, setWorkspacePath] = useState<string | null>(null)
    const [recentWorkspaces, setRecentWorkspaces] = useState<WorkspaceInfo[]>([])

    useEffect(() => {
        const restore = async() => {
            const workspace = await window.novakshar.workspace.getCurrent()
            if(!workspace) return
            setWorkspaceName(workspace.name)
            setWorkspacePath(workspace.path)
        }
        restore()
    }, [])

    const createWorkspace = async() => {
        const workspace = await window.novakshar.workspace.create()
        if(!workspace) return
        setWorkspaceName(workspace.name)
        setWorkspacePath(workspace.path)
        await refreshRecents()
    }

    const openWorkspace = async() => {
        const workspace = await window.novakshar.workspace.open()
        if(!workspace) return
        setWorkspaceName(workspace.name)
        setWorkspacePath(workspace.path)
        await refreshRecents()
    }

    const closeWorkspace = async() => {
        await window.novakshar.workspace.close()
        setWorkspaceName(null)
        setWorkspacePath(null)
    }

    const refreshRecents = async() => {
        const recents = await window.novakshar.workspace.getRecents()
        setRecentWorkspaces(recents)
    }

    const openRecentWorkspace = async(path: string) => {
        const workspace = await window.novakshar.workspace.openRecent(path)
        if(!workspace) return
        setWorkspaceName(workspace.name)
        setWorkspacePath(workspace.path)
        await refreshRecents()
    }

    const removeRecentWorkspace = async(path: string) => {
        await window.novakshar.workspace.removeRecent(path)
        await refreshRecents()
    }

    useEffect(() => {
        refreshRecents()
    }, [])

    const value: WorkspaceContextValue = {
        isOpen: workspaceName !== null && workspacePath !== null,
        workspaceName,
        workspacePath,
        recentWorkspaces,
        createWorkspace,
        openWorkspace,
        closeWorkspace,
        openRecentWorkspace,
        removeRecentWorkspace
    }

    return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext)
    if(!context) throw new Error('Workspace Provider is not available.')
    return context
}
