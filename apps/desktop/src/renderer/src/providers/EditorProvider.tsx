import { calculateMarkdownStatistics } from '@renderer/utils/MarkdownStatistics'
import { EditorSessionState } from '@shared/editor'
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react'
import { useExplorer } from './ExplorerProvider'

interface EditorContextValue {
    documents: readonly EditorDocumentState[]
    activeDocument: EditorDocumentState | null
    activeDocumentID: string | null
    openDocument(documentID: string, activate?: boolean): Promise<void>
    activateDocument(documentID: string): void
    closeDocument(documentID: string): Promise<boolean>
    updateMarkdown(markdown: string): void
    saveDocument(): Promise<void>
    nextTab(): void
    previousTab(): void
    beginTabDrag(documentID: string): void
    dropTab(documentID: string): void
    endTabDrag(): void
}

interface EditorDocumentState {
    id: string
    title: string
    markdown: string
    dirty: boolean
    statistics: EditorStatistics
}

interface EditorStatistics {
    words: number
    characters: number
    lines: number
    readingTime: number
}

const EditorContext = createContext<EditorContextValue | null>(null)

export function EditorProvider({ children }: PropsWithChildren) {
    const { selectDocument } = useExplorer()
    const [documents, setDocuments] = useState<EditorDocumentState[]>([])
    const [activeDocumentID, setActiveDocumentID] = useState<string | null>(null)
    const autosaveTimer = useRef<number | null>(null)
    const restored = useRef(false)
    const dragDocumentID = useRef<string | null>(null)

    const activeDocument = documents.find(d => d.id === activeDocumentID) || null

    const createSessionState = (): EditorSessionState => ({
        openDocuments: [...new Set(documents.map(d => d.id))],
        activeDocumentID
    })

    const openDocument = async(documentID: string, activate = true) => {
        const existing = documents.find(d => d.id === documentID)
        if(existing) {
            if(activate) setActiveDocumentID(documentID)
            return
        }
        const opened = await window.novakshar.editor.open(documentID)
        const state: EditorDocumentState = { ...opened, dirty: false, statistics: calculateMarkdownStatistics(opened.markdown) }
        setDocuments(prev => {
            if(prev.some(d => d.id === documentID)) return prev
            return [...prev, state]
        })
        setActiveDocumentID(documentID)
    }

    const activateDocument = (documentID: string) => {
        const existing = documents.find(d => d.id === documentID)
        if(!existing) return
        setActiveDocumentID(documentID)
        selectDocument(documentID)
    }

    const closeDocument = async(documentID: string) => {
        const document = documents.find(d => d.id === documentID)
        if(!document) return false
        if(document.dirty) {
            const result = await window.novakshar.editor.confirmClose(document.title)
            if(result === 'cancel') return false
            if(result === 'save') await performSave(document)
        }
        setDocuments(prev => {
            const index = prev.findIndex(d => d.id === documentID)
            if(index === -1) return prev
            const remaining = prev.filter(d => d.id !== documentID)
            if(activeDocumentID === documentID) {
                const neighbour = prev[index + 1] || prev[index - 1]
                setActiveDocumentID(neighbour?.id ?? null)
                selectDocument(neighbour?.id ?? null)
            }
            return remaining
        })
        return true
    }

    const updateMarkdown = (markdown: string) => {
        setDocuments(prev => prev.map(d => {
            if(d.id !== activeDocumentID) return d
            if(d.markdown === markdown) return d
            return { ...d, markdown, dirty: true, statistics: calculateMarkdownStatistics(markdown) }
        }))
    }

    const saveDocument = async() => {
        if(!activeDocument) return
        await performSave(activeDocument)
        if(autosaveTimer.current) {
            clearTimeout(autosaveTimer.current)
            autosaveTimer.current = null
        }
    }

    const nextTab = () => {
        if(documents.length <= 1) return
        const index = documents.findIndex(d => d.id === activeDocumentID)
        const nextIndex = (index + 1) % documents.length
        setActiveDocumentID(documents[nextIndex].id)
    }

    const previousTab = () => {
        if(documents.length <= 1) return
        const index = documents.findIndex(d => d.id === activeDocumentID)
        const prevIndex = (index - 1 + documents.length) % documents.length
        setActiveDocumentID(documents[prevIndex].id)
    }

    const performSave = async(document: EditorDocumentState) => {
        if(!document.dirty) return
        await window.novakshar.editor.save(document.id, document.markdown)
        setDocuments(prev => prev.map(d => {
            if(d.id !== document.id) return d
            return { ...d, dirty: false }
        }))
    }

    const beginTabDrag = (documentID: string) => {
        dragDocumentID.current = documentID
    }

    const dropTab = (documentID: string) => {
        const draggedID = dragDocumentID.current
        if(!draggedID || draggedID === documentID) return
        setDocuments(prev => {
            const documents = [...prev]
            const srcIndex = documents.findIndex(d => d.id === draggedID)
            const destIndex = documents.findIndex(d => d.id === documentID)
            if(srcIndex === -1 || destIndex === -1) return prev
            const [dragged] = documents.splice(srcIndex, 1)
            documents.splice(destIndex, 0, dragged)
            return documents
        })
        dragDocumentID.current = null
    }

    const endTabDrag = () => {
        dragDocumentID.current = null
    }

    useEffect(() => {
        if(!activeDocument) return
        if(!activeDocument.dirty) return
        if(autosaveTimer.current) clearTimeout(autosaveTimer.current)
        autosaveTimer.current = window.setTimeout(() => performSave(activeDocument), 2000)
        return () => {
            if(autosaveTimer.current) clearTimeout(autosaveTimer.current)
        }
    }, [activeDocument?.id, activeDocument?.dirty, activeDocument?.markdown])

    useEffect(() => {
        return () => {
            if(autosaveTimer.current) clearTimeout(autosaveTimer.current)
        }
    }, [])

    useEffect(() => {
        const handle = setTimeout(() => {
            window.novakshar.editor.saveSession(createSessionState())
        }, 250)
        return () => clearTimeout(handle)
    }, [documents, activeDocumentID])

    useEffect(() => {
        if(restored.current) return
        restored.current = true
        const restore = async() => {
            const session = await window.novakshar.editor.loadSession()
            for(const id of session.openDocuments) {
                try { await openDocument(id, false) }
                catch { }
            }
            if(session.activeDocumentID) setActiveDocumentID(session.activeDocumentID)
        }
        restore()
    }, [])

    const value: EditorContextValue = {
        documents,
        activeDocument,
        activeDocumentID,
        openDocument,
        activateDocument,
        closeDocument,
        updateMarkdown,
        saveDocument,
        nextTab,
        previousTab,
        beginTabDrag,
        dropTab,
        endTabDrag
    }

    return <EditorContext.Provider value={value}>
        {children}
    </EditorContext.Provider>
}

export function useEditor() {
    const context = useContext(EditorContext)
    if(!context) throw new Error('Editor Provider is not available.')
    return context
}
