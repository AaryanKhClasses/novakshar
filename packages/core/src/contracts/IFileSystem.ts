export interface IFileSystem {
    exists(path: string): Promise<boolean>
    readText(path: string): Promise<string>
    writeText(path: string, content: string): Promise<void>
    createDirectory(path: string): Promise<void>
    delete(path: string): Promise<void>
    move(source: string, destination: string): Promise<void>
    copy(source: string, destination: string): Promise<void>
    list(path: string): Promise<string[]>
}
