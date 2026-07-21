import AsyncStorage from '@react-native-async-storage/async-storage'

export interface ApplicationState {
    version: number
    lastWorkspacePath: string | null
}

export const DefaultApplicationState: ApplicationState = {
    version: 1,
    lastWorkspacePath: null
}

export class ApplicationStore {
    private static readonly KEY = 'novakshar.application'

    public async load(): Promise<ApplicationState> {
        const value = await AsyncStorage.getItem(ApplicationStore.KEY)
        if(!value) return DefaultApplicationState
        try {
            return JSON.parse(value) as ApplicationState
        } catch {
            return DefaultApplicationState
        }
    }

    public async save(state: ApplicationState): Promise<void> {
        await AsyncStorage.setItem(ApplicationStore.KEY, JSON.stringify(state))
    }
}
