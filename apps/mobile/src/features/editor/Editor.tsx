import { Text, View } from 'react-native'
import { useWorkspace } from '../../providers'

export function Editor() {
    const { workspaceName } = useWorkspace()

    return <View className="flex-1 items-center justify-center bg-editor">
        <Text className="text-2xl font-bold text-text">{workspaceName}</Text>
    </View>
}
