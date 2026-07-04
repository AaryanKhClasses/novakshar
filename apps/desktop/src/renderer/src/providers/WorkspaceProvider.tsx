import { createContext, useState, type PropsWithChildren } from 'react'

export interface WorkspaceContextValue {
    isOpen: boolean
    workspaceName: string | null
    workspacePath: string | null

    createWorkspace: (name: string, path: string) => Promise<void>
    openWorkspace: (path: string) => Promise<void>
    closeWorkspace: () => Promise<void>
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: PropsWithChildren) {
    const [workspaceName, setWorkspaceName] = useState<string | null>(null)
    const [workspacePath, setWorkspacePath] = useState<string | null>(null)

    const createWorkspace = async(path: string, name: string) => {
        await window.novakshar.workspace.create({ path, name })
        setWorkspaceName(name)
        setWorkspacePath(path)
    }

    const openWorkspace = async(path: string) => {
        await window.novakshar.workspace.open({ path })
        setWorkspacePath(path)
    }

    const closeWorkspace = async() => {
        await window.novakshar.workspace.close()
        setWorkspaceName(null)
        setWorkspacePath(null)
    }

    const value: WorkspaceContextValue = {
        isOpen: workspaceName !== null && workspacePath !== null,
        workspaceName,
        workspacePath,
        createWorkspace,
        openWorkspace,
        closeWorkspace
    }

    return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
