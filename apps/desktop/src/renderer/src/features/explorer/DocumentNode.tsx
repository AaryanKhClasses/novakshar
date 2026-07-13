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
            }} className={`cursor-pointer text-sm items-center flex gap-2 pl-5 py-1 animate ${selectedDocumentID === document.id ? 'bg-explorer-selected border-l-2 border-border-focus text-text' : 'hover:bg-explorer-hover text-text-alt hover:text-text'}`}>
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
            className="border-b border-border-focus outline-none"
        ></input> : <span>{document.title}</span>}
    </div>
}
