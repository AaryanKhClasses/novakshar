import { faFile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Pressable, Text } from 'react-native'
import { useWorkspace } from '../../providers'
import { DocumentInfo } from '../../types'

export function DocumentNode({ document }: { document: DocumentInfo }) {
    const { selectedDocumentID, openDocument } = useWorkspace()

    return <Pressable onPress={e => {
            e.stopPropagation()
            openDocument(document.id)
        }} className={`text-sm items-start flex flex-row gap-2 pl-5 py-1 ${selectedDocumentID === document.id && 'bg-explorer-selected border-l-2 border-border-focus'}`}
    >
        <Text><FontAwesomeIcon style={{ color: selectedDocumentID === document.id ? '#e6edf3' : '#8b949e' }} icon={faFile} /></Text>
        <Text className={`${selectedDocumentID === document.id ? 'text-text' : 'text-text-alt'}`}>{document.title}</Text>
    </Pressable>
}
