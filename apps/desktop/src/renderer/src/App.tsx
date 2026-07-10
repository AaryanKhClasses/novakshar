import { AppFrame } from './layouts/AppFrame'
import { ApplicationProvider, EditorProvider, ExplorerProvider, WorkspaceProvider } from './providers'

export default function App() {
    return <ApplicationProvider>
        <WorkspaceProvider>
            <ExplorerProvider>
                <EditorProvider>
                    <AppFrame />
                </EditorProvider>
            </ExplorerProvider>
        </WorkspaceProvider>
    </ApplicationProvider>
}
