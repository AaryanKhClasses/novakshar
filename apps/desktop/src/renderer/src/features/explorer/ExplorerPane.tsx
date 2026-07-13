import { faFileCirclePlus, faFolderPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useExplorer } from '@renderer/providers'
import { ExplorerContextMenu } from './ExplorerContextMenu'
import { ExplorerTree } from './ExplorerTree'

export function ExplorerPane() {
    const { folders, documents, createFolder, createDocument } = useExplorer()

    return <div className="h-full py-2 flex flex-col gap-1 bg-explorer text-text-muted border-r border-border">
        <div className="flex items-center justify-between px-3">
            <div className="font-medium text-text-alt p-1 text-sm tracking-wide">EXPLORER</div>
            <div className="flex gap-1 justify-end items-center">
                <button onClick={async() => await createFolder()} className="cursor-pointer hover:text-text hover:bg-explorer-hover p-1 animate focus:outline-none focus:text-text focus:bg-explorer-hover"><FontAwesomeIcon icon={faFolderPlus} /></button>
                <button onClick={async() => await createDocument()} className="cursor-pointer hover:text-text hover:bg-explorer-hover p-1 animate focus:outline-none focus:text-text focus:bg-explorer-hover"><FontAwesomeIcon icon={faFileCirclePlus} /></button>
            </div>
        </div>
        <hr className="border-border w-[90%] mx-auto" />
        <ExplorerTree folders={folders} documents={documents} />
        <ExplorerContextMenu />
    </div>
}
