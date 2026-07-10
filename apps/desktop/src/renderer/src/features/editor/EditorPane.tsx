import { headingsPlugin, listsPlugin, markdownShortcutPlugin, MDXEditor, quotePlugin, thematicBreakPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useEditor } from '@renderer/providers'

export function EditorPane() {
    const { document, updateMarkdown } = useEditor()
    const plugins = [
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin()
    ]

    if(!document) return <div className="flex h-full items-center justify-center text-primary-500">
        Open a document to start editing
    </div>
    return <div className="h-full overflow-auto p-6">
        <MDXEditor key={document.id} markdown={document.markdown} onChange={updateMarkdown} plugins={plugins} />
    </div>
}
