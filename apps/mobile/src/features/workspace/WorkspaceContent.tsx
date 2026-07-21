import { Editor, WelcomeScreen } from '..'
import { useWorkspace } from '../../providers'

export function WorkspaceContent() {
    const { isOpen } = useWorkspace()
    return !isOpen ? <WelcomeScreen /> : <Editor />
}
