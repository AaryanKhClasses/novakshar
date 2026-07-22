import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useWorkspace } from '../../providers'
import { FolderInfo } from '../../types'
import { DocumentNode } from './DocumentNode'

interface Props {
    folder: FolderInfo
    folders: FolderInfo[]
}

export function FolderNode({ folder, folders }: Props) {
    const { documents, selectedFolderID, selectFolder } = useWorkspace()
    const [expanded, setExpanded] = useState(false)
    const folderChildren = folders.filter(f => f.parentID === folder.id)
    const folderDocuments = documents.filter(d => d.folderID === folder.id)
    const children = [...folderChildren, ...folderDocuments]

    return <View>
        <Pressable
            onPress={e => {
                e.stopPropagation()
                selectFolder(folder.id)
                setExpanded(!expanded)
            }} className={`text-sm flex flex-row items-start gap-2 pl-5 py-1 ${selectedFolderID === folder.id && 'bg-explorer-selected border-l-2 border-border-focus'}`}
        >
            <Text>{expanded ? <FontAwesomeIcon style={{ color: selectedFolderID === folder.id ? '#e6edf3' : '#8b949e' }} icon={faFolderOpen} /> : <FontAwesomeIcon style={{ color: selectedFolderID === folder.id ? '#e6edf3' : '#8b949e' }} icon={faFolder} /> }</Text>
            <Text className={`${selectedFolderID === folder.id ? 'text-text' : 'text-text-alt'}`}>{folder.name}</Text>
        </Pressable>
        {expanded && children.length > 0 && <View className="ml-3">
            {folderChildren.map(child => <FolderNode key={child.id} folder={child} folders={folders} />)}
        </View>}
        {expanded && <View className="ml-2">
            {folderDocuments.map(document => <DocumentNode key={document.id} document={document} />)}
        </View>}
    </View>
}
