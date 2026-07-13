import { useExplorer } from '@renderer/providers'

export function ExplorerContextMenu() {
    const { contextMenu, hideContextMenu, createFolder, createDocument, beginRename, deleteFolder, deleteDocument } = useExplorer()

    if(!contextMenu) return null
    return <>
        <div className="fixed inset-0 z-40" onClick={hideContextMenu} />
        <div className="fixed z-50 min-w-48 border border-border bg-explorer-selected shadow shadow-explorer-hover" style={{ left: contextMenu.x, top: contextMenu.y }}>
            {contextMenu.type === 'folder' && <>
                <MenuItem label="New Folder" onClick={async() => {
                    hideContextMenu()
                    await createFolder()
                }} />
                <MenuItem label="New Document" onClick={async() => {
                    hideContextMenu()
                    await createDocument()
                }} />
                <hr className="my-2 border-border" />
                <MenuItem label="Rename Folder" onClick={async() => {
                    hideContextMenu()
                    beginRename(contextMenu.id, 'folder')
                }} />
                <MenuItem className="hover:bg-danger" label="Delete Folder" onClick={async() => {
                    hideContextMenu()
                    await deleteFolder(contextMenu.id)
                }} />
            </>}
            {contextMenu.type === 'document' && <>
                <MenuItem label="Rename Document" onClick={async() => {
                    hideContextMenu()
                    beginRename(contextMenu.id, 'document')
                }} />
                <MenuItem className="hover:bg-danger" label="Delete Document" onClick={async() => {
                    hideContextMenu()
                    await deleteDocument(contextMenu.id)
                }} />
            </>}
        </div>
    </>
}

function MenuItem({ label, onClick, className }: { label: string, onClick: () => void, className?: string }) {
    return <button className={`${className || ''} flex w-full px-3 py-1.5 text-left text-text-alt hover:text-text hover:bg-explorer-hover cursor-pointer animate`} onClick={onClick}>{label}</button>
}
