export interface IDocumentFileStore {
    create(relativePath: string, title: string): Promise<void>
    move(oldRelativePath: string, newRelativePath: string): Promise<void>
    delete(relativePath: string): Promise<void>
    exists(relativePath: string): Promise<boolean>
    read(relativePath: string): Promise<string>
    write(relativePath: string, content: string): Promise<void>
}
