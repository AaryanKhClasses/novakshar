import { WorkspaceContext } from '@renderer/providers'
import { useContext } from 'react'
import { EditorPane, WelcomeScreen } from '..'

export function WorkspaceContent() {
    const workspace = useContext(WorkspaceContext)
    if(!workspace) throw new Error('WorkspaceContext is not available')

    if(!workspace.isOpen) return <WelcomeScreen />
    return <EditorPane />
}
