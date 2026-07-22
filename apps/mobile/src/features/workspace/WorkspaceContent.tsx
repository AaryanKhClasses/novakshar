import { WorkspaceScreen, WelcomeScreen } from '..'
import { useWorkspace } from '../../providers'

export function WorkspaceContent() {
    const { isOpen } = useWorkspace()
    return !isOpen ? <WelcomeScreen /> : <WorkspaceScreen />
}
