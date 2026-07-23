import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Pressable, Text, View } from 'react-native'
import { useWorkspace } from '../../providers'

export function Editor() {
    const { documents, selectedDocumentID, showExplorer } = useWorkspace()
    const document = selectedDocumentID ? documents.find(d => d.id === selectedDocumentID) : null

    return <View className="flex-1 bg-editor">
        <View className="flex flex-row items-center gap-3 px-4 py-3 border-b border-border bg-tab">
            <Pressable onPress={showExplorer}>
                <FontAwesomeIcon color="#8b949e" icon={faBars} />
            </Pressable>
            <Text className="text-text-alt font-bold text-lg">{document ? document.title : 'Untitled'}</Text>
        </View>
        <View className="flex-1 items-center justify-center">
            <Text className="text-text-muted">Editor content goes here</Text>
        </View>
    </View>
}
