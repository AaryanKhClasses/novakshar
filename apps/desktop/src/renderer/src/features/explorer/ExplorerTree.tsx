import { FolderInfo } from '@shared/folder'
import { FolderNode } from './FolderNode'

export function ExplorerTree({ folders }: { folders: FolderInfo[] }) {
    const roots = folders.filter(f => f.parentID === null)
    return roots.map(folder => <FolderNode key={folder.id} folder={folder} folders={folders} />)
}
