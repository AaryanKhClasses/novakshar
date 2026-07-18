import { faFolder, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useWorkspace } from '@renderer/providers'

export function WelcomeScreen() {
    const { createWorkspace, openWorkspace, recentWorkspaces, openRecentWorkspace, removeRecentWorkspace } = useWorkspace()
    return <div className="flex flex-col h-full items-center justify-center bg-editor text-text">
        <div className="mb-5 text-center">
            <div className="text-5xl font-bold">Welcome to Novakshar</div>
            <p className="mt-2 text-text-muted">A Fully Customizable Local-First Markdown Editor</p>
        </div>
        <div className="flex gap-4">
            <button onClick={createWorkspace} className="px-4 py-2 rounded-xl bg-editor-toolbar border border-border cursor-pointer hover:bg-explorer-hover focus:outline-none focus:bg-explorer-hover focus:border-border-focus animate">Create Workspace</button>
            <button onClick={openWorkspace} className="px-4 py-2 rounded-xl bg-editor-toolbar border border-border cursor-pointer hover:bg-explorer-hover focus:outline-none focus:bg-explorer-hover focus:border-border-focus animate">Open Workspace</button>
        </div>
        {recentWorkspaces.length > 0 && <>
            <hr className="my-6 border border-border-alt w-[70%] mx-auto" />
            <div className="mx-auto w-[70%]">
                <h2 className="mb-4 text-xl font-semibold">Recent Workspaces</h2>
                {recentWorkspaces.map(workspace => <button
                    onClick={() => openRecentWorkspace(workspace.path)}
                    className="flex items-center text-left justify-between w-full px-4 py-2 rounded-xl bg-editor-toolbar border border-border cursor-pointer hover:bg-explorer-hover focus:outline-none focus:bg-explorer-hover focus:border-border-focus animate"    
                >
                    <div className="flex items-center gap-4">
                        <FontAwesomeIcon icon={faFolder} className="text-text-muted" />
                        <div className="flex flex-col gap-1">
                            <span className="font-medium line-clamp-1">{workspace.name}</span>
                            <span className="text-sm text-text-muted line-clamp-1">{workspace.path}</span>
                        </div>
                    </div>
                    <button onClick={(e) => {
                        e.stopPropagation()
                        removeRecentWorkspace(workspace.path)
                    }} className="px-1 rounded-lg text-text-alt focus:outline-none hover:text-text focus:text-danger cursor-pointer animate"><FontAwesomeIcon icon={faXmark} /></button>
                </button>)}
            </div>
        </>}
    </div>
}
