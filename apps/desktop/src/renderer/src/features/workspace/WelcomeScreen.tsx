import { WorkspaceContext } from '@renderer/providers'
import { useContext } from 'react'

export function WelcomeScreen() {
    const workspace = useContext(WorkspaceContext)
    if(!workspace) throw new Error('WorkspaceContext is not available')

    return <div className="flex flex-col items-center justify-center gap-6">
        <div className="text-5xl font-bold">Novakshar</div>
        <div className="flex gap-4">
            <button onClick={() => workspace.createWorkspace()} className="px-4 py-2 rounded-xl border">Create Workspace</button>
            <button onClick={() => workspace.openWorkspace()} className="px-4 py-2 rounded-xl border">Open Workspace</button>
        </div>
    </div>
}
