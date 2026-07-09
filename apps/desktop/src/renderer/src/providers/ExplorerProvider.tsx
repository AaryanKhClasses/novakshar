import { FolderInfo } from '@shared/folder'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

export interface ExplorerContextMenuState {
    folderID: string
    x: number
    y: number
}

export interface ExplorerEditingState {
    folderID: string
    value: string
    isNew: boolean
}

interface ExplorerContextValue {
    folders: FolderInfo[]
    selectedFolderID: string | null
    contextMenu: ExplorerContextMenuState | null
    editing: ExplorerEditingState | null
    refresh(): Promise<void>
    createFolder(): Promise<void>
    renameFolder(folderID: string, name: string): Promise<void>
    deleteFolder(folderID: string): Promise<void>
    selectFolder(folderID: string | null): void
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
    const [selectedFolderID, setSelectedFolderID] = useState<string | null>(null)
    const [contextMenu, setContextMenu] = useState<ExplorerContextMenuState | null>(null)
    const [editing, setEditing] = useState<ExplorerEditingState | null>(null)

    const refresh = async() => {
        const folders = await window.novakshar.explorer.getFolders()
        setFolders(folders)
        if(selectedFolderID && !folders.find(f => f.id === selectedFolderID)) setSelectedFolderID(null)
    }

    const createFolder = async() => {
        const folder = await window.novakshar.explorer.createFolder(selectedFolderID)
        await refresh()
        setSelectedFolderID(folder.id)
        setEditing({ folderID: folder.id, value: folder.name, isNew: true })
    }

    const renameFolder = async(folderID: string, name: string) => {
        await window.novakshar.explorer.renameFolder(folderID, name)
        await refresh()
    }

    const deleteFolder = async(folderID: string) => {
        await window.novakshar.explorer.deleteFolder(folderID)
        await refresh()
    }

    const selectFolder = (folderID: string | null) => {
        setSelectedFolderID(folderID)
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
        setEditing({ folderID, value: folder.name, isNew: false })
    }

    const updateEditingValue = (value: string) => {
        if(!editing) return
        setEditing({ ...editing, value })
    }

    const cancelRename = () => {
        if(editing?.isNew) deleteFolder(editing.folderID)
        setEditing(null)
    }

    const commitRename = async () => {
        if(!editing) return
        const name = editing.value.trim()
        if(name.length === 0) {
            cancelRename()
            return
        }
        await renameFolder(editing.folderID, name)
        setEditing(null)
    }

    useEffect(() => {
        refresh()
    }, [])

    const value: ExplorerContextValue = {
        folders,
        selectedFolderID,
        contextMenu,
        editing,
        refresh,
        createFolder,
        renameFolder,
        deleteFolder,
        selectFolder,
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
