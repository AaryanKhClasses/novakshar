import { DocumentInfo } from '@shared/document'
import { FolderInfo } from '@shared/folder'
import { WorkspaceInfo } from '@shared/workspace'

export { }

declare global {
    interface Window {
        novakshar: {
            window: {
                minimize(): Promise<void>
                maximize(): Promise<void>
                close(): Promise<void>
                isMaximized(): Promise<boolean>
            },
            workspace: {
                ping(): Promise<string>
                create(): Promise<WorkspaceInfo | null>
                open(): Promise<WorkspaceInfo | null>
                getCurrent(): Promise<WorkspaceInfo | null>
                close(): Promise<void>
                getRecents(): Promise<WorkspaceInfo[]>
                openRecent(path: string): Promise<WorkspaceInfo | null>
                removeRecent(path: string): Promise<void>
            },
            explorer: {
                getRootFolders(): Promise<FolderInfo[]>
                getFolders(): Promise<FolderInfo[]>
                getDocuments(): Promise<DocumentInfo[]>
                createFolder(parentID: string | null): Promise<FolderInfo>
                createDocument(folderID: string | null): Promise<DocumentInfo>
                renameFolder(folderID: string, name: string): Promise<void>
                renameDocument(documentID: string, title: string): Promise<void>
                deleteFolder(folderID: string): Promise<void>
                deleteDocument(documentID: string): Promise<void>
                moveFolder(folderID: string, parentID: string | null): Promise<void>
                moveDocument(documentID: string, folderID: string | null): Promise<void>
            },
            editor: {
                open(documentID: string): Promise<OpenDocumentInfo>
                save(documentID: string, markdown: string): Promise<void>
                confirmClose(title: string): Promise<'save' | 'discard' | 'cancel'>
                saveSession(session: any): Promise<void>
                loadSession(): Promise<any>
            }
        }
    }
}
