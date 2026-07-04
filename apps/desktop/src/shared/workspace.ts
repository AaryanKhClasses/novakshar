export interface WorkspaceInfo {
    name: string
    path: string
}

export interface CreateWorkspaceRequest {
    path: string
    name: string
}

export interface OpenWorkspaceRequest {
    path: string
}
