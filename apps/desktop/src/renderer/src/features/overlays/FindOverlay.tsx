import { useEditorSearch } from '@mdxeditor/editor'
import { useOverlay } from '@renderer/providers'
import { useEffect, useState } from 'react'

export function FindOverlay() {
    const { search, setSearch, next, prev, total, cursor, replace, replaceAll } = useEditorSearch()
    const { replaceEnabled, hideOverlay } = useOverlay()
    const [replacement, setReplacement] = useState('')

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if(e.key === 'Escape') {
                e.preventDefault()
                hideOverlay()
            }
        }

        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [hideOverlay])

    const handleFindKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            e.preventDefault()
            next()
        }
        if(e.shiftKey && e.key === 'Enter') {
            e.preventDefault()
            prev()
        }
    }

    const handleReplaceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            e.preventDefault()
            replace(replacement)
        }
    }

    return <div className="absolute p-2 top-10 z-50 left-1/2 w-175 -translate-x-1/2 rounded-xl border border-tonal-alt bg-tonal text-text-alt shadow-xl">
        <div className="flex items-center gap-2">
            <input
                autoFocus
                autoComplete="off"
                value={search ?? ""}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                onKeyDown={handleFindKeyDown}
                className="flex-1 px-2 py-1 rounded border border-tonal-alt bg-tonal text-text-alt focus:outline-none focus:ring focus:ring-primary-500 animate"
            />
            <span className="text-sm text-text-alt">{cursor}/{total}</span>
            <button
                onClick={prev}
                className="px-2 py-1 rounded border border-tonal-alt bg-tonal text-text-alt hover:bg-tonal-alt focus:outline-none focus:ring focus:ring-primary-500 animate"
            >Previous</button>
            <button
                onClick={next}
                className="px-2 py-1 rounded border border-tonal-alt bg-tonal text-text-alt hover:bg-tonal-alt focus:outline-none focus:ring focus:ring-primary-500 animate"
            >Next</button>
        </div>
        {replaceEnabled && <div className="flex items-center gap-2 mt-2">
            <input
                autoComplete="off"
                value={replacement}
                onChange={e => setReplacement(e.target.value)}
                placeholder="Replace..."
                onKeyDown={handleReplaceKeyDown}
                className="flex-1 px-2 py-1 rounded border border-tonal-alt bg-tonal text-text-alt focus:outline-none focus:ring focus:ring-primary-500 animate"
            />
            <button
                onClick={() => replace(replacement)}
                className="px-2 py-1 rounded border border-tonal-alt bg-tonal text-text-alt hover:bg-tonal-alt focus:outline-none focus:ring focus:ring-primary-500 animate"
            >Replace</button>
            <button
                onClick={() => replaceAll(replacement)}
                className="px-2 py-1 rounded border border-tonal-alt bg-tonal text-text-alt hover:bg-tonal-alt focus:outline-none focus:ring focus:ring-primary-500 animate"
            >Replace All</button>
        </div>}
    </div>
}
