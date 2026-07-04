export { }

declare global {
    interface Window {
        novakshar: {
            workspace: {
                ping(): Promise<string>
            }
        }
    }
}
