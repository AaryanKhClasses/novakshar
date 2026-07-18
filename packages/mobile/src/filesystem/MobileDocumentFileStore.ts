import { Constants, IDocumentFileStore, IFileSystem } from '@novakshar/core'

export class MobileDocumentFileStore implements IDocumentFileStore {
    constructor(
        private readonly fileSystem: IFileSystem,
        private readonly workspacePath: string
    ) { }

    private resolve(relativePath: string): string {
        return `${this.workspacePath}/${Constants.NotesFolder}/${relativePath}`
    }
    
    public async create(relativePath: string, title: string): Promise<void> {
        const absolutePath = this.resolve(relativePath)
        await this.fileSystem.createDirectory(this.dirname(absolutePath))
        await this.fileSystem.writeFile(absolutePath, `\n`)
    }
    
    public async move(oldRelativePath: string, newRelativePath: string): Promise<void> {
        const destination = this.resolve(newRelativePath)
        await this.fileSystem.createDirectory(this.dirname(destination))
        await this.fileSystem.move(this.resolve(oldRelativePath), destination)
    }
    
    public async delete(relativePath: string): Promise<void> {
        await this.fileSystem.deleteFile(this.resolve(relativePath))
    }
    
    public async exists(relativePath: string): Promise<boolean> {
        return this.fileSystem.exists(this.resolve(relativePath))
    }
    
    public async read(relativePath: string): Promise<string> {
        return this.fileSystem.readFile(this.resolve(relativePath))
    }
    
    public async write(relativePath: string, content: string): Promise<void> {
        await this.fileSystem.writeFile(this.resolve(relativePath), content)
    }

    private dirname(filePath: string): string {
        const index = filePath.lastIndexOf('/')
        return index === -1 ? filePath : filePath.slice(0, index)
    }
}
