import { PropsWithChildren, useEffect } from 'react'
import { OverlayType, useEditor, useExplorer, useOverlay, useView, useWorkspace } from '.'

export function ShortcutProvider({ children }: PropsWithChildren) {
    const editor = useEditor()
    const workspace = useWorkspace()
    const explorer = useExplorer()
    const overlay = useOverlay()
    const view = useView()

    useEffect(() => {
        const handler = async(e: KeyboardEvent) => {
            const ctrl = e.ctrlKey || e.metaKey
            const shift = e.shiftKey
            const alt = e.altKey
            const key = e.key.toLocaleLowerCase()

            if(e.isComposing) return

            function performAction(action: any | Promise<any>) {
                e.preventDefault()
                action
            }

            if(ctrl && alt && key === 'z') performAction(view.toggleZenMode())
            else if(ctrl && alt && key === 'f') performAction(view.toggleFocusMode())
            else if(ctrl && shift && key === 'n') performAction(workspace.createWorkspace())
            else if(ctrl && shift && key === 'o') performAction(workspace.openWorkspace())
            else if(ctrl && key === 's') performAction(await editor.saveDocument())
            else if(ctrl && key === 'w') performAction(editor.activeDocumentID && await editor.closeDocument(editor.activeDocumentID))
            else if(ctrl && !shift && e.key === 'Tab') performAction(editor.nextTab())
            else if(ctrl && shift && e.key === 'Tab') performAction(editor.previousTab())
            else if(ctrl && key === 'p') performAction(overlay.toggleOverlay(OverlayType.QuickOpen))
            else if(ctrl && key === 'f') performAction(overlay.toggleOverlay(OverlayType.Find))
            else if(ctrl && key === 'g') performAction(overlay.toggleOverlay(OverlayType.GotoLine))
            else if(ctrl && key === 'h') performAction(overlay.toggleOverlay(OverlayType.Find, true))
            else if(ctrl && shift && key === 'f') performAction(overlay.toggleOverlay(OverlayType.GlobalSearch))
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [editor, workspace, explorer, view, overlay])

    return <>{children}</>
}
