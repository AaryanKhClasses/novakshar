import { faFileCirclePlus, faFolderPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useExplorer, useWorkspace } from '@renderer/providers'
import { ExplorerContextMenu, ExplorerTree } from '..'

export function ExplorerFilesTab() {
    const { folders, documents, createFolder, createDocument } = useExplorer()
    const { workspaceName } = useWorkspace()

    return <>
        <div className="flex items-center justify-between px-3">
            <div className="text-text-alt p-1 text-sm tracking-wide line-clamp-1">{workspaceName}</div>
            <div className="flex gap-1 justify-end items-center">
                <button onClick={async() => await createFolder()} className="cursor-pointer hover:text-text hover:bg-explorer-hover p-1 animate focus:outline-none focus:text-text focus:bg-explorer-hover"><FontAwesomeIcon icon={faFolderPlus} /></button>
                <button onClick={async() => await createDocument()} className="cursor-pointer hover:text-text hover:bg-explorer-hover p-1 animate focus:outline-none focus:text-text focus:bg-explorer-hover"><FontAwesomeIcon icon={faFileCirclePlus} /></button>
            </div>
        </div>
        <hr className="border-border w-[90%] mx-auto" />
        <ExplorerTree folders={folders} documents={documents} />
        <ExplorerContextMenu />
    </>
}
