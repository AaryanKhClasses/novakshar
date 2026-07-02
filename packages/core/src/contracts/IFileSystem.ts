export interface IFileSystem {
    exists(path: string): Promise<boolean>
    createDirectory(path: string): Promise<void>
    deleteDirectory(path: string): Promise<void>
    readFile(path: string): Promise<string>
    writeFile(path: string, content: string): Promise<void>
    deleteFile(path: string): Promise<void>
    move(source: string, destination: string): Promise<void>
    copy(source: string, destination: string): Promise<void>
}
