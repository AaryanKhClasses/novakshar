import { faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEditor } from '@renderer/providers'

export function Tabs() {
    const { documents, activeDocumentID, activateDocument, closeDocument } = useEditor()
    return <div className="flex items-center border-b px-4">
        {documents.map(d => <div key={d.id} onClick={() => activateDocument(d.id)} className={`cursor-pointer border-b-2 py-2 px-4 ${d.id === activeDocumentID ? 'border-primary-500' : 'border-transparent hover:border-surface'}`}>
            {d.title}
            <span onClick={async e => {
                e.stopPropagation()
                await closeDocument(d.id)
            }} className="ml-2 hover:text-danger animate">{d.dirty ? '●' :<FontAwesomeIcon className="text-sm" icon={faX} />}</span>
        </div>)}
    </div>
}
