import { Constants } from '@novakshar/core'
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react'
import RNFS from 'react-native-fs'

export interface WorkspaceDTO {
    name: string
    path: string
}

export interface ApplicationContextValue {
    workspaces: WorkspaceDTO[]
}

export const ApplicationContext = createContext<ApplicationContextValue | null>(null)

export function ApplicationProvider({ children }: PropsWithChildren) {
    const [workspaces, setWorkspaces] = useState<WorkspaceDTO[]>([])

    useEffect(() => {
        const fetchWorkspaces = async() => {
            const workspacesDir = `${RNFS.DocumentDirectoryPath}/workspaces`
            const exists = await RNFS.exists(workspacesDir)
            if(!exists) await RNFS.mkdir(workspacesDir)
            const workspaceDirs = await RNFS.readDir(workspacesDir)
            const workspaceDTOs: WorkspaceDTO[] = []
            for(const dir of workspaceDirs) {
                if(dir.isDirectory()) {
                    const workspaceJsonPath = `${dir.path}/${Constants.WorkspaceFolder}/${Constants.WorkspaceFile}`
                    const workspaceJsonExists = await RNFS.exists(workspaceJsonPath)
                    if(workspaceJsonExists) {
                        const json = JSON.parse(await RNFS.readFile(workspaceJsonPath, 'utf8'))
                        workspaceDTOs.push({
                            name: json.name,
                            path: json.rootPath
                        })
                    }
                }
            }
            setWorkspaces(workspaceDTOs)
        }
        fetchWorkspaces()
    }, [])

    const value: ApplicationContextValue = {
        workspaces
    }

    return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>
}

export function useApplication() {
    const context = useContext(ApplicationContext)
    if(!context) throw new Error('Application Provider is not available.')
    return context
}
