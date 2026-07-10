import { faFile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEditor, useExplorer } from '@renderer/providers'
import { DocumentInfo } from '@shared/document'

export function DocumentNode({ document }: { document: DocumentInfo }) {
    const { selectedDocumentID, editing, updateEditingValue, commitRename, cancelRename, selectDocument, showContextMenu } = useExplorer()
    const { openDocument } = useEditor()

    return <div onClick={e => {
                e.stopPropagation()
                selectDocument(document.id)
                openDocument(document.id)
            }} onContextMenu={e => {
                e.preventDefault()
                selectDocument(document.id)
                showContextMenu(document.id, e.clientX, e.clientY, 'document')
            }} className={`flex cursor-pointer items-center gap-2 px-2 py-1 select-none animate ${selectedDocumentID === document.id ? 'bg-primary-500' : 'hover:bg-surface-alt'}`}>
        <span><FontAwesomeIcon icon={faFile} /></span>
        {editing?.id === document.id ? <input
            autoFocus
            autoComplete="off"
            value={editing.value}
            onChange={e => updateEditingValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={e => {
                if(e.key === 'Enter') commitRename()
                if(e.key === 'Escape') cancelRename()
            }}
            className="border border-tonal-alt bg-primary-500 px-2 py-1 outline-none"
        ></input> : <span>{document.title}</span>}
    </div>
}
