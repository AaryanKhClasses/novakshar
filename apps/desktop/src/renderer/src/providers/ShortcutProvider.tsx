import { PropsWithChildren, useEffect } from 'react'
import { OverlayType, useEditor, useExplorer, useOverlay, useWorkspace } from '.'

export function ShortcutProvider({ children }: PropsWithChildren) {
    const editor = useEditor()
    const workspace = useWorkspace()
    const explorer = useExplorer()
    const overlay = useOverlay()

    useEffect(() => {
        const handler = async(e: KeyboardEvent) => {
            const ctrl = e.ctrlKey || e.metaKey
            const shift = e.shiftKey
            const key = e.key.toLocaleLowerCase()

            if(e.isComposing) return

            function performAction(action: any | Promise<any>) {
                e.preventDefault()
                action
            }
        
            if(ctrl && key === 's') performAction(await editor.saveDocument())
            if(ctrl && key === 'w') performAction(editor.activeDocumentID && await editor.closeDocument(editor.activeDocumentID))
            if(ctrl && !shift && e.key === 'Tab') performAction(editor.nextTab())
            if(ctrl && shift && e.key === 'Tab') performAction(editor.previousTab())
            if(ctrl && key === 'p') performAction(overlay.toggleOverlay(OverlayType.QuickOpen))
            if(ctrl && key === 'f') performAction(overlay.toggleOverlay(OverlayType.Find))
            if(ctrl && key === 'g') performAction(overlay.toggleOverlay(OverlayType.GotoLine))
            if(ctrl && key === 'h') performAction(overlay.toggleOverlay(OverlayType.Find, true))
            if(ctrl && shift && key === 'f') performAction(overlay.toggleOverlay(OverlayType.GlobalSearch))
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [editor, workspace, explorer])

    return <>{children}</>
}
