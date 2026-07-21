import { MobileBootstrap, WorkspaceSession } from '@novakshar/mobile'
import { createContext, PropsWithChildren, useContext, useRef, useState } from 'react'
import RNFS from 'react-native-fs'

export interface WorkspaceContextValue {
    isOpen: boolean
    session: WorkspaceSession | null
    workspaceName: string | null
    workspacePath: string | null
    createWorkspace: (name: string) => Promise<void>
    openWorkspace: (path: string) => Promise<void>
    closeWorkspace: () => Promise<void>
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: PropsWithChildren) {
    const bootstrap = useRef(new MobileBootstrap())
    const [workspaceName, setWorkspaceName] = useState<string | null>(null)
    const [workspacePath, setWorkspacePath] = useState<string | null>(null)
    const [session, setSession] = useState<WorkspaceSession | null>(null)

    const createWorkspace = async(name: string) => {
        const path = `${RNFS.DocumentDirectoryPath}/workspaces/` + name.replaceAll(' ', '-')
        const session = await bootstrap.current.createWorkspace(path, name)
        setSession(session)
        setWorkspaceName(name)
        setWorkspacePath(path)
    }

    const openWorkspace = async(path: string) => {
        const session = await bootstrap.current.openWorkspace(path)
        setSession(session)
        setWorkspaceName(session.workspace.name)
        setWorkspacePath(path)
    }

    const closeWorkspace = async() => {
        await session?.dispose()
        setSession(null)
        setWorkspaceName(null)
        setWorkspacePath(null)
    }

    const value: WorkspaceContextValue = {
        isOpen: workspaceName !== null && workspacePath !== null,
        session,
        workspaceName,
        workspacePath,
        createWorkspace,    
        openWorkspace,
        closeWorkspace
    }

    return <WorkspaceContext.Provider value={value}>
        {children}
    </WorkspaceContext.Provider>
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext)
    if(!context) throw new Error('Workspace Provider is not available.')
    return context
}
