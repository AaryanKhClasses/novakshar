import { AppFrame } from './layouts/AppFrame'
import { ApplicationProvider, EditorProvider, ExplorerProvider, ShortcutProvider, WorkspaceProvider } from './providers'

export default function App() {
    return <ApplicationProvider>
        <WorkspaceProvider>
            <ExplorerProvider>
                <EditorProvider>
                    <ShortcutProvider>
                        <AppFrame />
                    </ShortcutProvider>
                </EditorProvider>
            </ExplorerProvider>
        </WorkspaceProvider>
    </ApplicationProvider>
}
