import { AppSettings } from '../models/AppSettings'

export interface ISettingsStore {
    load(): Promise<AppSettings>
    save(settings: AppSettings): Promise<void>
}
