import { IFileSystem } from "@novakshar/core"
import RNFS from "react-native-fs"

export class MobileFileSystem implements IFileSystem {
    public async exists(path: string): Promise<boolean> {
        return RNFS.exists(path)
    }

    public async createDirectory(path: string): Promise<void> {
        await RNFS.mkdir(path)
    }

    public async deleteDirectory(path: string): Promise<void> {
        await RNFS.unlink(path)
    }

    public async readFile(path: string): Promise<string> {
        return RNFS.readFile(path, 'utf8')
    }

    public async writeFile(path: string, content: string): Promise<void> {
        await RNFS.writeFile(path, content, 'utf8')
    }

    public async deleteFile(path: string): Promise<void> {
        await RNFS.unlink(path)
    }

    public async move(source: string, destination: string): Promise<void> {
        await RNFS.moveFile(source, destination)
    }

    public async copy(source: string, destination: string): Promise<void> {
        await RNFS.copyFile(source, destination)
    }
}
