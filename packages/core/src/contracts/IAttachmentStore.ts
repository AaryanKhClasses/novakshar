import { Attachment } from '../models/Attachment'

export interface IAttachmentStore {
    get(id: string): Promise<Attachment | null>
    save(Attachment: Attachment): Promise<void>
    delete(id: string): Promise<void>
}
