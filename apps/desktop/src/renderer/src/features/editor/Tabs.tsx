import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEditor } from '@renderer/providers'

export function Tabs() {
    const { documents, activeDocumentID, activateDocument, closeDocument } = useEditor()
    return <div className={`flex items-center ${documents.length > 0 ? 'border-b border-tonal' : ''} bg-tonal-alt text-text-alt overflow-x-auto`}>
        {documents.map(d => <div key={d.id} onClick={() => activateDocument(d.id)} className={`cursor-pointer h-full flex items-center justify-center gap-2 px-4 animate ${d.id === activeDocumentID ? 'bg-primary-500' : 'hover:bg-surface'}`}>
            {d.title}
            <span onClick={async e => {
                e.stopPropagation()
                await closeDocument(d.id)
            }} className="hover:text-danger animate">{d.dirty ? '●' :<FontAwesomeIcon className="text-sm" icon={faCircleXmark} />}</span>
        </div>)}
    </div>
}
