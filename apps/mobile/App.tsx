import { Pressable, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MobileBootstrap } from '@novakshar/mobile'
import RNFS from 'react-native-fs'

export default function App() {
    const createWorkspace = async() => {
        try {
            const bootstrap = new MobileBootstrap()
            const session = await bootstrap.createWorkspace(
                `${RNFS.DocumentDirectoryPath}/workspaces/my-workspace`, "My Workspace"
            )
            console.log(session.workspace)
        } catch(err) {
            console.error(err)
        }
    }

    return <SafeAreaView className="flex-1 items-center justify-center bg-editor">
        <Text className="text-text text-3xl font-bold">Novakshar Mobile</Text>
        <Pressable onPress={createWorkspace} className="mt-4 px-4 py-2 bg-blue-500 rounded">
            <Text className="text-text text-lg">Create Workspace</Text>
        </Pressable>
    </SafeAreaView>
}
