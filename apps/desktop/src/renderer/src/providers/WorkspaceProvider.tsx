import { createContext, type PropsWithChildren } from 'react'
import { WorkspaceSession } from '@novakshar/desktop'

export interface WorkspaceContextValue {
    session: WorkspaceSession | null
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: PropsWithChildren) {
    const value: WorkspaceContextValue = { session: null }
    return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
