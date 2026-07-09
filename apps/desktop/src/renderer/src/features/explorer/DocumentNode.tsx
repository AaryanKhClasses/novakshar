import { faFile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DocumentInfo } from '@shared/document'

export function DocumentNode({ document }: { document: DocumentInfo }) {
    return <div className="ml-2 cursor-pointer items-center gap-1 rounded-xl px-1 py-0.5 select-none transition duration-300 ease-in-out hover:bg-neutral-700 hover:text-white">
        <span><FontAwesomeIcon icon={faFile} /></span>
        <span>{document.title}</span>
    </div>
}
