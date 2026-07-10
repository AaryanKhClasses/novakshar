import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react'

export interface WorkspaceContextValue {
    isOpen: boolean
    workspaceName: string | null
    workspacePath: string | null

    createWorkspace: () => Promise<void>
    openWorkspace: () => Promise<void>
    closeWorkspace: () => Promise<void>
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: PropsWithChildren) {
    const [workspaceName, setWorkspaceName] = useState<string | null>(null)
    const [workspacePath, setWorkspacePath] = useState<string | null>(null)

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
    }

    const openWorkspace = async() => {
        const workspace = await window.novakshar.workspace.open()
        if(!workspace) return
        setWorkspaceName(workspace.name)
        setWorkspacePath(workspace.path)
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

export function useWorkspace() {
    const context = useContext(WorkspaceContext)
    if(!context) throw new Error('Workspace Provider is not available.')
    return context
}
