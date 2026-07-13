import { headingsPlugin, listsPlugin, markdownShortcutPlugin, MDXEditor, quotePlugin, searchPlugin, thematicBreakPlugin, toolbarPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useEditor } from '@renderer/providers'
import { EditorToolbar } from './EditorToolbar'

export function EditorPane() {
    const { activeDocument, updateMarkdown } = useEditor()
    const plugins = [
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        searchPlugin(),
        toolbarPlugin({
            toolbarContents: () => <EditorToolbar />,
            toolbarPosition: 'bottom',
            toolbarClassName: 'editor-toolbar'
        })
    ]

    if(!activeDocument) return <div className="flex h-full items-center justify-center bg-editor text-2xl text-text-alt">
        Open a document to start editing
    </div>
    return <div className="relative prose prose-invert prose-p:my-0 prose-headings:mb-4 max-w-none h-full overflow-y-auto p-6 bg-editor text-text">
        <div className="w-[70%] mx-auto overflow-y-auto max-h-full">
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
