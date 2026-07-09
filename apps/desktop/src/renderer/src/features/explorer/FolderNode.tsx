import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useExplorer } from '@renderer/providers'
import { FolderInfo } from '@shared/folder'
import { useState } from 'react'
import { DocumentNode } from './DocumentNode'

interface Props {
    folder: FolderInfo
    folders: FolderInfo[]
}

export function FolderNode({ folder, folders }: Props) {
    const { documents, selectedFolderID, selectFolder, showContextMenu, editing, updateEditingValue, commitRename, cancelRename } = useExplorer()
    const [expanded, setExpanded] = useState(false)
    const folderChildren = folders.filter(f => f.parentID === folder.id)
    const folderDocuments = documents.filter(d => d.folderID === folder.id)
    const children = [...folderChildren, ...folderDocuments]

    return <div>
        <div onClick={e => {
                e.stopPropagation()
                selectFolder(folder.id)
                setExpanded(!expanded)
            }} onContextMenu={e => {
                e.preventDefault()
                selectFolder(folder.id)
                showContextMenu(folder.id, e.clientX, e.clientY, 'folder')
            }} className={`cursor-pointer items-center flex gap-2 px-2 py-1 select-none animate ${selectedFolderID === folder.id ? 'bg-primary-500' : 'hover:bg-surface-alt'}`}
        >
            {children.length > 0 ? <span>{expanded ? <FontAwesomeIcon icon={faFolderOpen} /> : <FontAwesomeIcon icon={faFolder} />}</span> : <FontAwesomeIcon icon={faFolder} />}
            {editing?.id === folder.id ? <input
                autoFocus
                autoComplete="off"
                value={editing.value}
                onChange={e => updateEditingValue(e.target.value)}
                onBlur={commitRename}
                onKeyDown={e => {
                    if(e.key === 'Enter') commitRename()
                    if(e.key === 'Escape') cancelRename()
                }}
                className="border border-tonal-alt bg-primary-500 px-2 py-1 outline-none ml-2"
            ></input> : <span>{folder.name}</span>}
        </div>
        {expanded && children.length > 0 && <div className="ml-2">
            {folderChildren.map(child => <FolderNode key={child.id} folder={child} folders={folders} />)}
        </div>}
        {expanded && <div className="ml-2">
            {folderDocuments.map(document => <DocumentNode key={document.id} document={document} />)}
        </div>}
    </div>
}
