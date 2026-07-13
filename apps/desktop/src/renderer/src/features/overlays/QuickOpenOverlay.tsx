import { useEditor, useExplorer, useOverlay } from '@renderer/providers'
import { useEffect, useState } from 'react'

export function QuickOpenOverlay() {
    const { documents, selectDocument } = useExplorer()
    const { hideOverlay } = useOverlay()
    const { openDocument } = useEditor()

    const [query, setQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)

    const filteredDocuments = documents.filter(d => 
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.relativePath.toLowerCase().includes(query.toLowerCase())
    )

    useEffect(() => {
        setSelectedIndex(0)
    }, [query])

    const handleKeyDown = async(e: React.KeyboardEvent<HTMLInputElement>) => {
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex(prev => Math.min(prev + 1, filteredDocuments.length - 1))
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex(prev => Math.max(prev - 1, 0))
                break
            case 'Enter':
                e.preventDefault()
                const document = filteredDocuments[selectedIndex]
                if(!document) return
                await openDocument(document.id)
                selectDocument(document.id)
                hideOverlay()
                break
            case 'Escape':
                e.preventDefault()
                hideOverlay()
                break
        }
    }

    return <div className="absolute p-2 top-10 z-50 left-1/2 w-175 -translate-x-1/2 rounded-xl border border-border bg-explorer text-text-alt shadow-xl">
        <input
            autoFocus
            autoComplete="off"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={async e => handleKeyDown(e)}
            placeholder="Search documents..."
            className="w-full px-2 py-1 rounded border border-border-alt text-text focus:outline-none focus:ring focus:ring-border-focus animate"
        />
        <div className="max-h-96 overflow-y-auto mt-2">
            {filteredDocuments.length > 0 ? filteredDocuments.map((d, i) => <div
                key={d.id}
                onClick={async () => {
                    await openDocument(d.id)
                    selectDocument(d.id)
                    hideOverlay()
                }}
                className={`cursor-pointer px-3 py-2 my-1 rounded-xl animate ${i === selectedIndex ? 'bg-primary text-text-inverted' : 'hover:bg-explorer-hover hover:text-text'}`}
            >
                <div>{d.title}</div>
                <div className="text-xs opacity-70 line-clamp-1">{d.relativePath}</div>
            </div>) : <div className="px-3 py-2 text-center opacity-70">No documents found</div>}
        </div>
    </div>
}
