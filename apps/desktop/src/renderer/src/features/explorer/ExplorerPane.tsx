import { useExplorer } from '@renderer/providers'

export function ExplorerPane() {
    const { folders, createFolder } = useExplorer()

    return <div className="h-full p-4">
        <button onClick={createFolder} className="mb-4 rounded-xl border px-2 py-1">Create New Folder</button>
        {folders.map(folder => <div key={folder.id}>{folder.name}</div>)}
    </div>
}
