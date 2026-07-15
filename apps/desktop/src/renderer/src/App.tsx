import { RealmProvider } from '@mdxeditor/editor'
import { AppFrame } from './layouts/AppFrame'
import { ApplicationProvider, EditorProvider, ExplorerProvider, OverlayProvider, ShortcutProvider, ViewProvider, WorkspaceProvider } from './providers'

export default function App() {
    return <ApplicationProvider>
        <WorkspaceProvider>
            <ExplorerProvider>
                <EditorProvider>
                    <ViewProvider>
                        <RealmProvider>
                            <OverlayProvider>
                                <ShortcutProvider>
                                    <AppFrame />
                                </ShortcutProvider>
                            </OverlayProvider>
                        </RealmProvider>
                    </ViewProvider>
                </EditorProvider>
            </ExplorerProvider>
        </WorkspaceProvider>
    </ApplicationProvider>
}
