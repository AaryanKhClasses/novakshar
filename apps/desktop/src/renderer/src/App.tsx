import { RealmProvider } from '@mdxeditor/editor'
import { AppFrame } from './layouts/AppFrame'
import { ApplicationProvider, EditorProvider, ExplorerProvider, OverlayProvider, ShortcutProvider, WorkspaceProvider } from './providers'

export default function App() {
    return <ApplicationProvider>
        <WorkspaceProvider>
            <ExplorerProvider>
                <EditorProvider>
                    <RealmProvider>
                        <OverlayProvider>
                            <ShortcutProvider>
                                <AppFrame />
                            </ShortcutProvider>
                        </OverlayProvider>
                    </RealmProvider>
                </EditorProvider>
            </ExplorerProvider>
        </WorkspaceProvider>
    </ApplicationProvider>
}
