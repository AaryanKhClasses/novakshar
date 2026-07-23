import { MobileBootstrap, WorkspaceSession } from '@novakshar/mobile'
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react'
import RNFS from 'react-native-fs'
import { useApplication } from '.'
import { DocumentInfo, FolderInfo } from '../types'

export interface WorkspaceContextValue {
    isOpen: boolean
    session: WorkspaceSession | null
    workspaceName: string | null
    workspacePath: string | null
    folders: FolderInfo[]
    documents: DocumentInfo[]
    selectedFolderID: string | null
    selectedDocumentID: string | null
    workspaceView: 'explorer' | 'editor'
    refreshExplorer: () => Promise<void>
    createWorkspace: (name: string) => Promise<void>
    openWorkspace: (path: string) => Promise<void>
    closeWorkspace: () => Promise<void>
    createFolder: (name: string) => Promise<void>
    createDocument: (title: string) => Promise<void>
    renameFolder: (folderID: string, name: string) => Promise<void>
    renameDocument: (documentID: string, title: string) => Promise<void>
    deleteFolder: (folderID: string) => Promise<void>
    deleteDocument: (documentID: string) => Promise<void>
    selectFolder: (folderID: string | null) => void
    selectDocument: (documentID: string | null) => void
    openDocument: (documentID: string) => Promise<void>
    showExplorer: () => void
    hideExplorer: () => void
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: PropsWithChildren) {
    const application = useApplication()
    const bootstrap = useRef(new MobileBootstrap())
    const [workspaceName, setWorkspaceName] = useState<string | null>(null)
    const [workspacePath, setWorkspacePath] = useState<string | null>(null)
    const [session, setSession] = useState<WorkspaceSession | null>(null)

    const [folders, setFolders] = useState<FolderInfo[]>([])
    const [documents, setDocuments] = useState<DocumentInfo[]>([])
    const [selectedFolderID, setSelectedFolderID] = useState<string | null>(null)
    const [selectedDocumentID, setSelectedDocumentID] = useState<string | null>(null)
    const [workspaceView, setWorkspaceView] = useState<'explorer' | 'editor'>('explorer')

    const createWorkspace = async(name: string) => {
        const path = `${RNFS.DocumentDirectoryPath}/workspaces/` + name.replaceAll(' ', '-')
        const session = await bootstrap.current.createWorkspace(path, name)
        setSession(session)
        setWorkspaceName(name)
        setWorkspacePath(path)
        await application.save({
            ...application.state,
            lastWorkspacePath: path
        })
    }

    const openWorkspace = async(path: string) => {
        const session = await bootstrap.current.openWorkspace(path)
        setSession(session)
        setWorkspaceName(session.workspace.name)
        setWorkspacePath(path)
        await application.save({
            ...application.state,
            lastWorkspacePath: path
        })
    }

    const closeWorkspace = async() => {
        await session?.dispose()
        setSession(null)
        setWorkspaceName(null)
        setWorkspacePath(null)
        await application.save({
            ...application.state,
            lastWorkspacePath: null
        })
    }

    const refreshExplorer = async() => {
        if(!session) return
        const folders = await session.folderService.getAll()
        const documents = await session.documentService.getAll()
        setFolders(folders.map(f => ({
            id: f.id,
            name: f.name,
            parentID: f.parentID ?? null,
            color: f.color ?? null,
            icon: f.icon ?? null
        })))
        setDocuments(documents.map(d => ({
            id: d.id,
            title: d.title,
            folderID: d.folderID ?? null,
            relativePath: d.relativePath,
            favorite: d.favorite
        })))
    }

    const createFolder = async(name: string) => {
        if(!session) return
        const context = { timestamp: new Date() }
        const folder = await session.folderService.create(context, name, selectedFolderID)
        await refreshExplorer()
        setSelectedFolderID(folder.id)
    }

    const createDocument = async(title: string) => {
        if(!session) return
        const context = { timestamp: new Date() }
        const folder = selectedFolderID ? await session.folderService.get(selectedFolderID) : null
        const relativePath = folder ? `${session.folderPathResolver.resolve(folder)}${title}.md` : `${title}.md`
        const document = await session.documentService.create(context, title, relativePath, selectedFolderID)
        await refreshExplorer()
        setSelectedDocumentID(document.id)
    }

    const renameFolder = async(folderID: string, name: string) => {
        if(!session) return
        const context = { timestamp: new Date() }
        await session.folderService.rename(context, folderID, name)
        await refreshExplorer()
    }

    const renameDocument = async(documentID: string, title: string) => {
        if(!session) return
        const context = { timestamp: new Date() }
        const document = await session.documentService.get(documentID)
        if(!document) return
        let newRelativePath: string
        if(document.folderID) {
            const folder = await session.folderService.get(document.folderID)
            if(!folder) return
            newRelativePath = `${session.folderPathResolver.resolve(folder)}${title}.md`
        } else newRelativePath = `${title}.md`
        await session.documentService.rename(context, documentID, title, newRelativePath)
        await refreshExplorer()
    }

    const deleteFolder = async(folderID: string) => {
        if(!session) return
        const context = { timestamp: new Date() }
        await session.folderService.delete(context, folderID)
        await refreshExplorer()
    }

    const deleteDocument = async(documentID: string) => {
        if(!session) return
        const context = { timestamp: new Date() }
        await session.documentService.delete(context, documentID)
        await refreshExplorer()
    }

    const selectFolder = (folderID: string | null) => {
        setSelectedFolderID(folderID)
        setSelectedDocumentID(null)
    }

    const selectDocument = (documentID: string | null) => {
        setSelectedDocumentID(documentID)
        setSelectedFolderID(null)
    }

    const openDocument = async(documentID: string) => {
        if(!session) return
        const document = await session.documentService.get(documentID)
        if(!document) return
        setSelectedDocumentID(documentID)
        setSelectedFolderID(null)
        setWorkspaceView('editor')
    }

    const showExplorer = () => setWorkspaceView('explorer')
    const hideExplorer = () => setWorkspaceView('editor')

    useEffect(() => {
        if(application.state.lastWorkspacePath) openWorkspace(application.state.lastWorkspacePath)
    }, [application.state.lastWorkspacePath])

    useEffect(() => {
        refreshExplorer()
    }, [session])

    const value: WorkspaceContextValue = {
        isOpen: workspaceName !== null && workspacePath !== null,
        session,
        workspaceName,
        workspacePath,
        folders,
        documents,
        selectedFolderID,
        selectedDocumentID,
        workspaceView,
        refreshExplorer,
        createWorkspace,
        openWorkspace,
        closeWorkspace,
        createFolder,
        createDocument,
        renameFolder,
        renameDocument,
        deleteFolder,
        deleteDocument,
        selectFolder,
        selectDocument,
        openDocument,
        showExplorer,
        hideExplorer
    }

    return <WorkspaceContext.Provider value={value}>
        {children}
    </WorkspaceContext.Provider>
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext)
    if(!context) throw new Error('Workspace Provider is not available.')
    return context
}
