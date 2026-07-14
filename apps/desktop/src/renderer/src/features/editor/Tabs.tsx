import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEditor } from '@renderer/providers'

export function Tabs() {
    const { documents, activeDocumentID, activateDocument, closeDocument, beginTabDrag, endTabDrag, dropTab } = useEditor()
    if(documents.length === 0) return <div className="bg-editor"></div>
    return <div className="flex items-center border-b border-border bg-editor text-sm text-text-alt overflow-x-auto">
        {documents.map(d => <div draggable
            onDragStart={() => beginTabDrag(d.id)}
            onDragEnd={() => endTabDrag()}
            onDragOver={e => e.preventDefault()}
            onDrop={() => dropTab(d.id)}
            key={d.id}
            onClick={() => activateDocument(d.id)}
            onAuxClick={async e => {
                if(e.button !== 1) return
                await closeDocument(d.id)
            }}
            className={`cursor-pointer h-full flex items-center justify-center gap-2 px-4 animate ${d.id === activeDocumentID ? 'bg-explorer hover:bg-explorer-selected text-text border-b-2 border-border-focus' : 'hover:bg-explorer-hover hover:text-text'}`}
        >
            {d.title}
            <span onClick={async e => {
                e.stopPropagation()
                await closeDocument(d.id)
            }} className="hover:text-text hover:bg-danger py-[0.1rem] px-[0.2rem] rounded animate">{d.dirty ? '●' :<FontAwesomeIcon className="text-xs" icon={faXmark} />}</span>
        </div>)}
    </div>
}
