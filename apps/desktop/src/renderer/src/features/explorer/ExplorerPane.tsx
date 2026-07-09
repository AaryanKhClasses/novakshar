import { useExplorer } from '@renderer/providers'
import { ExplorerTree } from './ExplorerTree'
import { ExplorerContextMenu } from './ExplorerContextMenu'

export function ExplorerPane() {
    const { folders, documents } = useExplorer()

    return <div className="h-full p-4">
        <ExplorerTree folders={folders} documents={documents} />
        <ExplorerContextMenu />
    </div>
}
