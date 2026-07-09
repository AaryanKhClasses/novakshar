import { useExplorer } from '@renderer/providers'

export function ExplorerContextMenu() {
    const { contextMenu, hideContextMenu, createFolder, beginRename, deleteFolder } = useExplorer()

    if(!contextMenu) return null
    return <>
        <div className="fixed inset-0 z-40" onClick={hideContextMenu} />
        <div className="fixed z-50 min-w-48 rounded-xl border border-neutral-700 bg-neutral-900 py-1 shadow-lg" style={{ left: contextMenu.x, top: contextMenu.y }}>
            <MenuItem label="New Folder" onClick={async() => {
                hideContextMenu()
                await createFolder()
            }} />
            <MenuItem label="Rename Folder" onClick={async() => {
                hideContextMenu()
                beginRename(contextMenu.folderID)
            }} />
            <MenuItem label="Delete Folder" onClick={async() => {
                hideContextMenu()
                await deleteFolder(contextMenu.folderID)
            }} />
        </div>
    </>
}

function MenuItem({ label, onClick }: { label: string, onClick: () => void }) {
    return <button className="flex w-full px-3 py-1.5 text-left text-white hover:bg-neutral-600 cursor-pointer" onClick={onClick}>{label}</button>
}
