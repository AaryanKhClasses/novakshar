import { headingsPlugin, listsPlugin, markdownShortcutPlugin, MDXEditor, quotePlugin, searchPlugin, thematicBreakPlugin, toolbarPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { OverlayType, useEditor, useExplorer, useOverlay } from '@renderer/providers'
import { EditorToolbar } from './EditorToolbar'

export function EditorPane() {
    const { activeDocument, updateMarkdown } = useEditor()
    const { createDocument } = useExplorer()
    const { toggleOverlay } = useOverlay()

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

    if(!activeDocument) return <div className="flex flex-col h-full items-center justify-center bg-editor text-text-alt">
        <div className="mb-5 text-center">
            <div className="text-5xl font-bold">Welcome to Novakshar</div>
            <p className="mt-2 text-text-muted">Select a document from the explorer or create a new one.</p>
        </div>
        <div className="flex gap-4">
            <button onClick={createDocument} className="px-4 py-2 rounded-xl bg-editor-toolbar border border-border cursor-pointer hover:bg-explorer-hover focus:outline-none focus:bg-explorer-hover focus:border-border-focus animate">New Document</button>
            <button onClick={() => toggleOverlay(OverlayType.QuickOpen)} className="px-4 py-2 rounded-xl bg-editor-toolbar border border-border cursor-pointer hover:bg-explorer-hover focus:outline-none focus:bg-explorer-hover focus:border-border-focus animate">Quick Open</button>
        </div>
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
