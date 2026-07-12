import { AppFrame } from './layouts/AppFrame'
import { ApplicationProvider, EditorProvider, ExplorerProvider, OverlayProvider, ShortcutProvider, WorkspaceProvider } from './providers'

export default function App() {
    return <ApplicationProvider>
        <WorkspaceProvider>
            <ExplorerProvider>
                <EditorProvider>
                    <OverlayProvider>
                        <ShortcutProvider>
                            <AppFrame />
                        </ShortcutProvider>
                    </OverlayProvider>
                </EditorProvider>
            </ExplorerProvider>
        </WorkspaceProvider>
    </ApplicationProvider>
}
