import { View } from 'react-native'
import { DocumentNode, FolderNode } from '..'
import { DocumentInfo, FolderInfo } from '../../types'

export function ExplorerTree({ folders, documents }: { folders: FolderInfo[], documents: DocumentInfo[] }) {
    const roots = folders.filter(f => f.parentID === null)
    const rootDocuments = documents.filter(d => d.folderID === null)
    return <View>
        {roots.map(folder => <FolderNode key={folder.id} folder={folder} folders={folders} />)}
        {rootDocuments.map(document => <DocumentNode key={document.id} document={document} />)}
    </View>
}
