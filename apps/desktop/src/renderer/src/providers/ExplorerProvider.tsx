import { DocumentInfo } from '@shared/document'
import { FolderInfo } from '@shared/folder'
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react'

export interface ExplorerContextMenuState {
    id: string
    x: number
    y: number
    type: 'folder' | 'document'
}

export interface ExplorerEditingState {
    id: string
    value: string
    isNew: boolean
    type: 'folder' | 'document'
}

interface DragData {
    type: 'folder' | 'document'
    id: string
}

export const ExplorerTabs = ['files', 'outline'] as const

interface ExplorerContextValue {
    explorerTab: typeof ExplorerTabs[number]
    folders: FolderInfo[]
    documents: DocumentInfo[]
    selectedFolderID: string | null
    selectedDocumentID: string | null
    contextMenu: ExplorerContextMenuState | null
    editing: ExplorerEditingState | null
    dropTargetID: string | null
    setExplorerTab(explorerTab: typeof ExplorerTabs[number]): void
    refresh(): Promise<void>
    createFolder(): Promise<void>
    createDocument(): Promise<void>
    renameFolder(folderID: string, name: string): Promise<void>
    renameDocument(documentID: string, title: string): Promise<void>
    deleteFolder(folderID: string): Promise<void>
    deleteDocument(documentID: string): Promise<void>
    selectFolder(folderID: string | null): Promise<void>
    selectDocument(documentID: string | null): void
    showContextMenu(id: string, x: number, y: number, type: 'folder' | 'document'): void
    hideContextMenu(): void
    beginRename(id: string, type: 'folder' | 'document'): void
    updateEditingValue(value: string): void
    commitRename(): Promise<void>
    cancelRename(): void
    findDocument(documentID: string): DocumentInfo | undefined
    beginDragFolder(folderID: string): void
    beginDragDocument(documentID: string): void
    setDropTargetID(folderID: string | null): void
    dropOnFolder(folderID: string): Promise<void>
    endDrag(): void
}

const ExplorerContext = createContext<ExplorerContextValue | null>(null)

export function ExplorerProvider({ children }: PropsWithChildren) {
    const [explorerTab, setView] = useState<typeof ExplorerTabs[number]>('files')
    const [folders, setFolders] = useState<FolderInfo[]>([])
    const [documents, setDocuments] = useState<DocumentInfo[]>([])
    const [selectedFolderID, setSelectedFolderID] = useState<string | null>(null)
    const [selectedDocumentID, setSelectedDocumentID] = useState<string | null>(null)
    const [contextMenu, setContextMenu] = useState<ExplorerContextMenuState | null>(null)
    const [editing, setEditing] = useState<ExplorerEditingState | null>(null)
    const dragData = useRef<DragData | null>(null)
    const [dropTargetID, setDropTargetID] = useState<string | null>(null)

    const setExplorerTab = (explorerTab: typeof ExplorerTabs[number]) => setView(explorerTab)

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

    const renameDocument = async(documentID: string, title: string) => {
        await window.novakshar.explorer.renameDocument(documentID, title)
        await refresh()
    }

    const deleteFolder = async(folderID: string) => {
        await window.novakshar.explorer.deleteFolder(folderID)
        await refresh()
    }

    const deleteDocument = async(documentID: string) => {
        await window.novakshar.explorer.deleteDocument(documentID)
        await refresh()
    }

    const selectFolder = async(folderID: string | null) => {
        setSelectedFolderID(folderID)
        setSelectedDocumentID(null)
    }

    const selectDocument = (documentID: string | null) => {
        setSelectedDocumentID(documentID)
        setSelectedFolderID(null)
    }

    const showContextMenu = (id: string, x: number, y: number, type: 'folder' | 'document') => {
        setContextMenu({ id, x, y, type })
    }

    const hideContextMenu = () => {
        setContextMenu(null)
    }

    const beginRename = (id: string, type: 'folder' | 'document') => {
        if(type === 'folder') {
            const folder = folders.find(f => f.id === id)
            if(!folder) return
            setEditing({ id: folder.id, value: folder.name, isNew: false, type: 'folder' })
        } else {
            const document = documents.find(d => d.id === id)
            if(!document) return
            setEditing({ id: document.id, value: document.title, isNew: false, type: 'document' })
        }
    }

    const updateEditingValue = (value: string) => {
        if(!editing) return
        setEditing({ ...editing, value })
    }

    const cancelRename = () => {
        if(editing?.isNew && editing.type === 'folder') deleteFolder(editing.id)
        if(editing?.isNew && editing.type === 'document') deleteDocument(editing.id)
        setEditing(null)
    }

    const commitRename = async () => {
        if(!editing) return
        const name = editing.value.trim()
        if(name.length === 0) {
            cancelRename()
            return
        }
        if(editing.type === 'folder') await renameFolder(editing.id, name)
        if(editing.type === 'document') await renameDocument(editing.id, name)
        setEditing(null)
    }

    const findDocument = (documentID: string): DocumentInfo | undefined => {
        return documents.find(d => d.id === documentID)
    }

    const beginDragFolder = (folderID: string) => {
        dragData.current = { type: 'folder', id: folderID }
    }

    const beginDragDocument = (documentID: string) => {
        dragData.current = { type: 'document', id: documentID }
    }

    const dropOnFolder = async (folderID: string) => {
        const dragged = dragData.current
        if(!dragged) return
        if(dragged.type === 'folder') {
            if(dragged.id === folderID) return
            await window.novakshar.explorer.moveFolder(dragged.id, folderID)
        } else await window.novakshar.explorer.moveDocument(dragged.id, folderID)
        endDrag()
        await refresh()
    }

    const endDrag = () => {
        dragData.current = null
    }

    useEffect(() => {
        refresh()
    }, [])

    const value: ExplorerContextValue = {
        explorerTab,
        folders,
        documents,
        selectedFolderID,
        selectedDocumentID,
        contextMenu,
        editing,
        setExplorerTab,
        dropTargetID,
        refresh,
        createFolder,
        createDocument,
        renameFolder,
        renameDocument,
        deleteFolder,
        deleteDocument,
        selectFolder,
        selectDocument,
        showContextMenu,
        hideContextMenu,
        beginRename,
        updateEditingValue,
        cancelRename,
        commitRename,
        findDocument,
        beginDragFolder,
        beginDragDocument,
        dropOnFolder,
        setDropTargetID,
        endDrag,
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
