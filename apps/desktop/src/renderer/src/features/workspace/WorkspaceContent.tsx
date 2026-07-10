import { useWorkspace } from '@renderer/providers'
import { EditorPane, WelcomeScreen } from '..'

export function WorkspaceContent() {
    const { isOpen } = useWorkspace()
    if(!isOpen) return <WelcomeScreen />
    return <EditorPane />
}
