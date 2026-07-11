import { useExplorer } from '@renderer/providers'
import { ExplorerTree } from './ExplorerTree'
import { ExplorerContextMenu } from './ExplorerContextMenu'
import { faFileCirclePlus, faFolderPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function ExplorerPane() {
    const { folders, documents, createFolder, createDocument } = useExplorer()

    return <div className="h-full py-3 flex flex-col gap-1 bg-tonal-alt text-text-alt border-r border-tonal">
        <div className="flex items-center justify-between px-3">
            <div className="font-semibold tracking-wide">EXPLORER</div>
            <div className="flex gap-1 justify-end items-center">
                <button onClick={async() => await createFolder()} className="cursor-pointer hover:text-primary-400 animate"><FontAwesomeIcon icon={faFolderPlus} /></button>
                <button onClick={async() => await createDocument()} className="cursor-pointer hover:text-primary-400 animate"><FontAwesomeIcon icon={faFileCirclePlus} /></button>
            </div>
        </div>
        <hr className="my-2 border-surface-alt" />
        <ExplorerTree folders={folders} documents={documents} />
        <ExplorerContextMenu />
    </div>
}
