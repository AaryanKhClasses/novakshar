import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react'

interface EditorContextValue {
    documents: readonly EditorDocumentState[]
    activeDocument: EditorDocumentState | null
    activeDocumentID: string | null
    openDocument(documentID: string): Promise<void>
    activateDocument(documentID: string): void
    closeDocument(documentID: string): Promise<boolean>
    updateMarkdown(markdown: string): void
    saveDocument(): Promise<void>
    nextTab(): void
    previousTab(): void
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
    const autosaveTimer = useRef<number | null>(null)

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
            }
            return remaining
        })
        return true
    }

    const updateMarkdown = (markdown: string) => {
        setDocuments(prev => prev.map(d => {
            if(d.id !== activeDocumentID) return d
            if(d.markdown === markdown) return d
            return { ...d, markdown, dirty: true }
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
        previousTab
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
