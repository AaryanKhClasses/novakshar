import { useExplorer } from '@renderer/providers'
import { FolderInfo } from '@shared/folder'
import { useState } from 'react'

interface Props {
    folder: FolderInfo
    folders: FolderInfo[]
}

export function FolderNode({ folder, folders }: Props) {
    const { selectedFolderID, selectFolder, showContextMenu, editing, updateEditingValue, commitRename, cancelRename } = useExplorer()
    const [expanded, setExpanded] = useState(false)
    const children = folders.filter(f => f.parentID === folder.id)

    return <div>
        <div onClick={e => {
                e.stopPropagation()
                selectFolder(folder.id)
                setExpanded(!expanded)
            }} onContextMenu={e => {
                e.preventDefault()
                selectFolder(folder.id)
                showContextMenu(folder.id, e.clientX, e.clientY)
            }} className={`cursor-pointer items-center gap-1 rounded-xl px-1 py-0.5 select-none transition duration-300 ease-in-out ${selectedFolderID === folder.id ? 'bg-blue-600 text-white' : 'hover:bg-neutral-700 hover:text-white'}`}
        >
            {children.length > 0 ? <span>{expanded ? 'v' : '>'}</span> : '•'}
            {editing?.folderID === folder.id ? <input
                autoFocus
                autoComplete="off"
                value={editing.value}
                onChange={e => updateEditingValue(e.target.value)}
                onBlur={commitRename}
                onKeyDown={e => {
                    if(e.key === 'Enter') commitRename()
                    if(e.key === 'Escape') cancelRename()
                }}
                className="rounded-xl border border-blue-500 bg-neutral-900 px-1 outline-none"
            ></input> : <span>{folder.name}</span>}
        </div>
        {expanded && children.length > 0 && <div className="ml-2">
            {children.map(child => <FolderNode key={child.id} folder={child} folders={folders} />)}
        </div>}
    </div>
}
