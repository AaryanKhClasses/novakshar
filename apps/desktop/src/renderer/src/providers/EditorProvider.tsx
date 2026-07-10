import { OpenDocumentInfo } from '@shared/editor'
import { createContext, PropsWithChildren, useContext, useState } from 'react'

interface EditorContextValue {
    document: OpenDocumentInfo | null
    openDocument(documentID: string): Promise<void>
    closeDocument(): void
    updateMarkdown(markdown: string): void
}

const EditorContext = createContext<EditorContextValue | null>(null)

export function EditorProvider({ children }: PropsWithChildren) {
    const [document, setDocument] = useState<OpenDocumentInfo | null>(null)

    const openDocument = async(documentID: string) => {
        const document = await window.novakshar.editor.open(documentID)
        setDocument(document)
    }

    const closeDocument = () => {
        setDocument(null)
    }

    const updateMarkdown = (markdown: string) => {
        setDocument(prev => {
            if(!prev) return prev
            return { ...prev, markdown, dirty: true }
        })
    }

    const value: EditorContextValue = {
        document,
        openDocument,
        closeDocument,
        updateMarkdown
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
