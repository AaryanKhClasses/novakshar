import { DocumentInfo } from '@shared/document'
import { FolderInfo } from '@shared/folder'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

export interface ExplorerContextMenuState {
    folderID: string
    x: number
    y: number
}

export interface ExplorerEditingState {
    id: string
    value: string
    isNew: boolean
    type: 'folder' | 'document'
}

interface ExplorerContextValue {
    folders: FolderInfo[]
    documents: DocumentInfo[]
    selectedFolderID: string | null
    selectedDocumentID: string | null
    contextMenu: ExplorerContextMenuState | null
    editing: ExplorerEditingState | null
    refresh(): Promise<void>
    createFolder(): Promise<void>
    createDocument(): Promise<void>
    renameFolder(folderID: string, name: string): Promise<void>
    deleteFolder(folderID: string): Promise<void>
    selectFolder(folderID: string | null): Promise<void>
    selectDocument(documentID: string | null): void
    showContextMenu(folderID: string, x: number, y: number): void
    hideContextMenu(): void
    beginRename(folderID: string): void
    updateEditingValue(value: string): void
    commitRename(): Promise<void>
    cancelRename(): void
}

const ExplorerContext = createContext<ExplorerContextValue | null>(null)

export function ExplorerProvider({ children }: PropsWithChildren) {
    const [folders, setFolders] = useState<FolderInfo[]>([])
    const [documents, setDocuments] = useState<DocumentInfo[]>([])
    const [selectedFolderID, setSelectedFolderID] = useState<string | null>(null)
    const [selectedDocumentID, setSelectedDocumentID] = useState<string | null>(null)
    const [contextMenu, setContextMenu] = useState<ExplorerContextMenuState | null>(null)
    const [editing, setEditing] = useState<ExplorerEditingState | null>(null)

    const refresh = async() => {
        const folders = await window.novakshar.explorer.getFolders()
        const documents = await window.novakshar.explorer.getDocuments()
        setFolders(folders)
        setDocuments(documents)

        if(selectedFolderID && !folders.some(f => f.id === selectedFolderID)) setSelectedFolderID(null)
        if(selectedDocumentID && !documents.some(d => d.id === selectedDocumentID)) setSelectedDocumentID(null)
    }

    const createFolder = async() => {
        const folder = await window.novakshar.explorer.createFolder(selectedFolderID)
        await refresh()
        setSelectedFolderID(folder.id)
        setEditing({ id: folder.id, value: folder.name, isNew: true, type: 'folder' })
    }

    const createDocument = async() => {
        const document = await window.novakshar.explorer.createDocument(selectedFolderID)
        await refresh()
        setSelectedDocumentID(document.id)
        setEditing({ id: document.id, value: document.title, isNew: true, type: 'document' })
    }

    const renameFolder = async(folderID: string, name: string) => {
        await window.novakshar.explorer.renameFolder(folderID, name)
        await refresh()
    }

    const deleteFolder = async(folderID: string) => {
        await window.novakshar.explorer.deleteFolder(folderID)
        await refresh()
    }

    const selectFolder = async(folderID: string | null) => {
        setSelectedFolderID(folderID)
    }

    const selectDocument = (documentID: string | null) => {
        setSelectedDocumentID(documentID)
    }

    const showContextMenu = (folderID: string, x: number, y: number) => {
        setContextMenu({ folderID, x, y })
    }

    const hideContextMenu = () => {
        setContextMenu(null)
    }

    const beginRename = (folderID: string) => {
        const folder = folders.find(f => f.id === folderID)
        if(!folder) return
        setEditing({ id: folder.id, value: folder.name, isNew: false, type: 'folder' })
    }

    const updateEditingValue = (value: string) => {
        if(!editing) return
        setEditing({ ...editing, value })
    }

    const cancelRename = () => {
        if(editing?.isNew) deleteFolder(editing.id)
        setEditing(null)
    }

    const commitRename = async () => {
        if(!editing) return
        const name = editing.value.trim()
        if(name.length === 0) {
            cancelRename()
            return
        }
        await renameFolder(editing.id, name)
        setEditing(null)
    }

    useEffect(() => {
        refresh()
    }, [])

    const value: ExplorerContextValue = {
        folders,
        documents,
        selectedFolderID,
        selectedDocumentID,
        contextMenu,
        editing,
        refresh,
        createFolder,
        createDocument,
        renameFolder,
        deleteFolder,
        selectFolder,
        selectDocument,
        showContextMenu,
        hideContextMenu,
        beginRename,
        updateEditingValue,
        cancelRename,
        commitRename
    }

    return <ExplorerContext.Provider value={value}>
        {children}
    </ExplorerContext.Provider>
}

export function useExplorer() {
    const context = useContext(ExplorerContext)
    if(!context) throw new Error('Explorer Provider is not available')
    return context
}
