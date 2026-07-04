import { AppFrame } from './layouts/AppFrame'
import { ApplicationProvider, WorkspaceProvider } from './providers'

export default function App() {
    return <ApplicationProvider>
        <WorkspaceProvider>
            <AppFrame />
        </WorkspaceProvider>
    </ApplicationProvider>
}
