import { useExplorer } from '@renderer/providers'

export function ExplorerPane() {
    const { folders, createFolder, renameFolder, deleteFolder } = useExplorer()

    return <div className="h-full p-4">
        <button onClick={createFolder} className="mb-4 rounded-xl border px-2 py-1">Create New Folder</button>
        {folders.map(folder => <div className="flex flex-row justify-between items-center">
            <h1>{folder.name}</h1>
            <div className="flex flex-row gap-1 items-center justify-end">
                <button onClick={() => renameFolder(folder.id, 'Renamed' + folder.name)}>Rename</button>
                <button onClick={() => deleteFolder(folder.id)}>Delete</button>
            </div>
        </div>)}
    </div>
}
