import { useExplorer } from '@renderer/providers'
import { ExplorerTree } from './ExplorerTree'
import { ExplorerContextMenu } from './ExplorerContextMenu'

export function ExplorerPane() {
    const { folders } = useExplorer()

    return <div className="h-full p-4">
        <ExplorerTree folders={folders} />
        <ExplorerContextMenu />
    </div>
}
