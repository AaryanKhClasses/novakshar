import { headingsPlugin, listsPlugin, markdownShortcutPlugin, MDXEditor, quotePlugin, searchPlugin, thematicBreakPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useEditor } from '@renderer/providers'

export function EditorPane() {
    const { activeDocument, updateMarkdown } = useEditor()
    const plugins = [
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        searchPlugin()
    ]

    if(!activeDocument) return <div className="flex h-full items-center justify-center bg-editor text-2xl text-text-alt">
        Open a document to start editing
    </div>
    return <div className="prose prose-invert prose-p:my-0 prose-headings:mb-4 max-w-none h-full overflow-auto p-6 bg-editor text-text">
            <div className="w-[70%] mx-auto">
            <MDXEditor
                contentEditableClassName='text-text!'
                key={activeDocument?.id}
                markdown={activeDocument?.markdown ?? ""}
                onChange={updateMarkdown}
                plugins={plugins}
            />
        </div>
    </div>
}
