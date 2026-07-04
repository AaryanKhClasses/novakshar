import { Layout } from './layout'
import { ApplicationProvider, WorkspaceProvider } from './providers'

export default function App() {
    return <ApplicationProvider>
        <WorkspaceProvider>
            <Layout />
        </WorkspaceProvider>
    </ApplicationProvider>
}
