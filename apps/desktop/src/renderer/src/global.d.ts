import { WorkspaceInfo } from '@shared/workspace'

export { }

declare global {
    interface Window {
        novakshar: {
            workspace: {
                ping(): Promise<string>
                create(): Promise<WorkspaceInfo | null>
                open(): Promise<WorkspaceInfo | null>
                close(): Promise<void>
            }
        }
    }
}
