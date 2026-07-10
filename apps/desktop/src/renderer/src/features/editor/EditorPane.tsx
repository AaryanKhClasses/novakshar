import { headingsPlugin, listsPlugin, markdownShortcutPlugin, MDXEditor, quotePlugin, thematicBreakPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useEditor } from '@renderer/providers'
import { useEffect } from 'react'

export function EditorPane() {
    const { activeDocument, updateMarkdown, saveDocument } = useEditor()
    const plugins = [
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin()
    ]

    useEffect(() => {
        const handler = async(e: KeyboardEvent) => {
            if((e.ctrlKey || e.metaKey) && e.key.toLocaleLowerCase() === 's') {
                e.preventDefault()
                await saveDocument()
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [saveDocument])

    if(!activeDocument) return <div className="flex h-full items-center justify-center text-primary-500">
        Open a document to start editing
    </div>
    return <div className="h-full overflow-auto p-6">
        <MDXEditor key={activeDocument?.id} markdown={activeDocument?.markdown ?? ""} onChange={updateMarkdown} plugins={plugins} />
    </div>
}
