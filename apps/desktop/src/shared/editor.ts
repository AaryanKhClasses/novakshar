export interface OpenDocumentInfo {
    id: string
    title: string
    markdown: string
    dirty: boolean
}

export interface EditorSessionState {
    openDocuments: string[]
    activeDocumentID: string | null
}
