import { Constants } from '@novakshar/core'
import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react'
import RNFS from 'react-native-fs'
import { ApplicationState, ApplicationStore, DefaultApplicationState } from '../store'

export interface WorkspaceDTO {
    name: string
    path: string
}

export interface ApplicationContextValue {
    workspaces: WorkspaceDTO[]
    state: ApplicationState
    save(state: ApplicationState): Promise<void>
}

export const ApplicationContext = createContext<ApplicationContextValue | null>(null)

export function ApplicationProvider({ children }: PropsWithChildren) {
    const store = useRef(new ApplicationStore())
    const [workspaces, setWorkspaces] = useState<WorkspaceDTO[]>([])
    const [state, setState] = useState<ApplicationState>(DefaultApplicationState)

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

    useEffect(() => {
        (async() => setState(await store.current.load()))()
    }, [])

    const save = async(newState: ApplicationState) => {
        await store.current.save(newState)
        setState(newState)
    }

    const value: ApplicationContextValue = {
        workspaces,
        state,
        save
    }

    return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>
}

export function useApplication() {
    const context = useContext(ApplicationContext)
    if(!context) throw new Error('Application Provider is not available.')
    return context
}
