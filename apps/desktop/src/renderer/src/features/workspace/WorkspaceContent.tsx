import { useWorkspace } from '@renderer/providers'
import { EditorOverlay, EditorPane, WelcomeScreen } from '..'

export function WorkspaceContent() {
    const { isOpen } = useWorkspace()
    if(!isOpen) return <WelcomeScreen />
    return <div className="h-full w-full relative">
        <EditorOverlay />
        <EditorPane />
    </div>
}
