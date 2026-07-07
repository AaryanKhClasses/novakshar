import { AppFrame } from './layouts/AppFrame'
import { ApplicationProvider, ExplorerProvider, WorkspaceProvider } from './providers'

export default function App() {
    return <ApplicationProvider>
        <WorkspaceProvider>
            <ExplorerProvider>
                <AppFrame />
            </ExplorerProvider>
        </WorkspaceProvider>
    </ApplicationProvider>
}
