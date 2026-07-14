import { WorkspaceContext } from '@renderer/providers'
import { useContext } from 'react'

export function WelcomeScreen() {
    const workspace = useContext(WorkspaceContext)
    if(!workspace) throw new Error('WorkspaceContext is not available')

    return <div className="flex flex-col items-center justify-center gap-6 bg-editor text-text">
        <div className="text-5xl font-bold">Welcome to Novakshar</div>
        <div className="flex gap-4">
            <button onClick={() => workspace.createWorkspace()} className="px-4 py-2 rounded-xl bg-editor-toolbar border border-border cursor-pointer hover:bg-explorer-hover animate">Create Workspace</button>
            <button onClick={() => workspace.openWorkspace()} className="px-4 py-2 rounded-xl bg-editor-toolbar border border-border cursor-pointer hover:bg-explorer-hover animate">Open Workspace</button>
        </div>
    </div>
}
