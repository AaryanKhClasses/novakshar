import { CreateWorkspaceRequest, OpenWorkspaceRequest, WorkspaceInfo } from '@shared/workspace'

export { }

declare global {
    interface Window {
        novakshar: {
            workspace: {
                ping(): Promise<string>
                create(request: CreateWorkspaceRequest): Promise<WorkspaceInfo>
                open(request: OpenWorkspaceRequest): Promise<WorkspaceInfo>
                close(): Promise<void>
            }
        }
    }
}
