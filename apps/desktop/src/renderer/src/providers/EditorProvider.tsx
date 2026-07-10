import { createContext, PropsWithChildren, useContext, useState } from 'react'

interface EditorContextValue {
    documents: readonly EditorDocumentState[]
    activeDocument: EditorDocumentState | null
    activeDocumentID: string | null
    openDocument(documentID: string): Promise<void>
    activateDocument(documentID: string): void
    closeDocument(documentID: string): void
    updateMarkdown(markdown: string): void
    saveDocument(): Promise<void>
}

interface EditorDocumentState {
    id: string
    title: string
    markdown: string
    dirty: boolean
}

const EditorContext = createContext<EditorContextValue | null>(null)

export function EditorProvider({ children }: PropsWithChildren) {
    const [documents, setDocuments] = useState<EditorDocumentState[]>([])
    const [activeDocumentID, setActiveDocumentID] = useState<string | null>(null)

    const activeDocument = documents.find(d => d.id === activeDocumentID) || null

    const openDocument = async(documentID: string) => {
        const existing = documents.find(d => d.id === documentID)
        if(existing) {
            setActiveDocumentID(documentID)
            return
        }
        const opened = await window.novakshar.editor.open(documentID)
        const state: EditorDocumentState = { ...opened, dirty: false }
        setDocuments(prev => [...prev, state])
        setActiveDocumentID(documentID)
    }

    const activateDocument = (documentID: string) => {
        const existing = documents.find(d => d.id === documentID)
        if(!existing) return
        setActiveDocumentID(documentID)
    }

    const closeDocument = (documentID: string) => {
        setDocuments(prev => {
            const index = prev.findIndex(d => d.id === documentID)
            if(index === -1) return prev
            const remaining = prev.filter(d => d.id !== documentID)
            if(activeDocumentID === documentID) {
                const neighbour = prev[index + 1] || prev[index - 1]
                setActiveDocumentID(neighbour?.id ?? null)
            }
            return remaining
        })
    }

    const updateMarkdown = (markdown: string) => {
        setDocuments(prev => prev.map(d => {
            if(d.id !== activeDocumentID) return d
            return { ...d, markdown, dirty: true }
        }))
    }

    const saveDocument = async() => {
        const document = activeDocument
        if(!document) return
        if(!document.dirty) return
        await window.novakshar.editor.save(document.id, document.markdown)
        setDocuments(prev => prev.map(d => {
            if(d.id !== activeDocumentID) return d
            return { ...d, dirty: false }
        }))
    }

    const value: EditorContextValue = {
        documents,
        activeDocument,
        activeDocumentID,
        openDocument,
        activateDocument,
        closeDocument,
        updateMarkdown,
        saveDocument
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
