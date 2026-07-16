import { HeadingInfo, useEditor } from '@renderer/providers'

export function ExplorerOutlineTab() {
    const { activeDocument } = useEditor()

    if(!activeDocument) return <div className="flex items-center justify-center h-full text-text-alt text-sm tracking-wide">Open a document to view its outline.</div>
    if(activeDocument.outline.length === 0) return <div className="flex items-center justify-center h-full text-text-alt text-sm tracking-wide">No headings found in this document.</div>
    return <ul className="flex flex-col gap-1 px-2 py-1 overflow-y-auto">
        {activeDocument.outline.map((heading, index) => <OutlineItem key={index} heading={heading} />)}
    </ul>
}

function OutlineItem({ heading }: { heading: HeadingInfo }) {
    const padding = {
        1: '',
        2: 'pl-4',
        3: 'pl-8',
        4: 'pl-12',
        5: 'pl-16',
        6: 'pl-20'
    }

    return <button className={`w-full px-3 py-1.5 text-left text-sm text-text-alt hover:bg-explorer-hover hover:text-text animate ${padding[heading.level]}`}>
        {heading.title}
    </button>
}
