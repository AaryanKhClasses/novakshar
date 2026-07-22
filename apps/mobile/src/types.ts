export interface FolderInfo {
    id: string
    name: string
    parentID: string | null
    color: string | null
    icon: string | null
}

export interface DocumentInfo {
    id: string
    title: string
    relativePath: string
    folderID: string | null
    favorite: boolean
}
