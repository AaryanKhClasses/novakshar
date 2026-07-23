import { SafeAreaView } from 'react-native-safe-area-context'
import { AppFrame } from './src/layouts/AppFrame'
import { ApplicationProvider, WorkspaceProvider } from './src/providers'

export default function App() {
    return <SafeAreaView className="flex-1 bg-editor">
        <ApplicationProvider>
            <WorkspaceProvider>
                <AppFrame />
            </WorkspaceProvider>
        </ApplicationProvider>
    </SafeAreaView>
}
