import { IFileSystem } from '@novakshar/core'
import { promises as fs } from 'node:fs'

export class DesktopFileSystem implements IFileSystem {
    public async exists(path: string): Promise<boolean> {
        try {
            await fs.access(path)
            return true
        } catch { return false }
    }

    public async createDirectory(path: string): Promise<void> {
        await fs.mkdir(path, { recursive: true })
    }

    public async deleteDirectory(path: string): Promise<void> {
        await fs.rm(path, { recursive: true, force: true })
    }

    public async readFile(path: string): Promise<string> {
        return await fs.readFile(path, 'utf8')
    }

    public async writeFile(path: string, content: string): Promise<void> {
        await fs.writeFile(path, content, 'utf8')
    }

    public async deleteFile(path: string): Promise<void> {
        await fs.rm(path, { force: true })
    }

    public async move(source: string, destination: string): Promise<void> {
        await fs.rename(source, destination)
    }

    public async copy(source: string, destination: string): Promise<void> {
        await fs.copyFile(source, destination)
    }
}
