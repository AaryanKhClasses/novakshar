import { PropsWithChildren, useEffect } from 'react'
import { useEditor, useExplorer, useWorkspace } from '.'

export function ShortcutProvider({ children }: PropsWithChildren) {
    const editor = useEditor()
    const workspace = useWorkspace()
    const explorer = useExplorer()

    useEffect(() => {
        const handler = async(e: KeyboardEvent) => {
            const ctrl = e.ctrlKey || e.metaKey
            const shift = e.shiftKey

            if(e.isComposing) return
            switch(true) {
                case ctrl && e.key.toLocaleLowerCase() === 's':
                    e.preventDefault()
                    await editor.saveDocument()
                    break
                case ctrl && shift && e.key.toLocaleLowerCase() === 'w':
                    e.preventDefault()
                    if(editor.activeDocumentID) await editor.closeDocument(editor.activeDocumentID)
                    break
                case ctrl && !shift && e.key === 'Tab':
                    e.preventDefault()
                    editor.nextTab()
                    break
                case ctrl && shift && e.key === 'Tab':
                    e.preventDefault()
                    editor.previousTab()
                    break
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [editor, workspace, explorer])

    return <>{children}</>
}
