import { DocumentInfo } from '@shared/document'
import { FolderInfo } from '@shared/folder'
import { DocumentNode } from './DocumentNode'
import { FolderNode } from './FolderNode'

export function ExplorerTree({ folders, documents }: { folders: FolderInfo[], documents: DocumentInfo[] }) {
    const roots = folders.filter(f => f.parentID === null)
    const rootDocuments = documents.filter(d => d.folderID === null)
    return <>
        {roots.map(folder => <FolderNode key={folder.id} folder={folder} folders={folders} />)}
        {rootDocuments.map(document => <DocumentNode key={document.id} document={document} />)}
    </>
}
