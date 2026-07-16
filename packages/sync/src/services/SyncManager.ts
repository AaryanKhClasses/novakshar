import { ISyncProvider } from '../index.js'

export class SyncManager {
    constructor(
        private readonly provider: ISyncProvider
    ) { }
}
