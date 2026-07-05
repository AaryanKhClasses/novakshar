import { AppSettings } from '../models/AppSettings.js'

export interface ISettingsStore {
    load(): Promise<AppSettings>
    save(settings: AppSettings): Promise<void>
}
