import { headingsPlugin, listsPlugin, markdownShortcutPlugin, MDXEditor, quotePlugin, thematicBreakPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useEditor } from '@renderer/providers'

export function EditorPane() {
    const { activeDocument, updateMarkdown } = useEditor()
    const plugins = [
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin()
    ]

    if(!activeDocument) return <div className="flex h-full items-center justify-center text-primary-500">
        Open a document to start editing
    </div>
    return <div className="h-full overflow-auto p-6">
        <MDXEditor key={activeDocument?.id} markdown={activeDocument?.markdown ?? ""} onChange={updateMarkdown} plugins={plugins} />
    </div>
}
