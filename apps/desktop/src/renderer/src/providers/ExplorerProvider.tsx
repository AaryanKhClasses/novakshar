import { FolderInfo } from '@shared/folder'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

interface ExplorerContextValue {
    folders: FolderInfo[]
    refresh(): Promise<void>
    createFolder(): Promise<void>
}

const ExplorerContext = createContext<ExplorerContextValue | null>(null)

export function ExplorerProvider({ children }: PropsWithChildren) {
    const [folders, setFolders] = useState<FolderInfo[]>([])

    const refresh = async() => {
        const folders = await window.novakshar.explorer.getRootFolders()
        setFolders(folders)
    }

    const createFolder = async() => {
        await window.novakshar.explorer.createFolder()
        await refresh()
    }

    useEffect(() => {
        refresh()
    }, [])

    const value: ExplorerContextValue = {
        folders,
        refresh,
        createFolder
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
