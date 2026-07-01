import { Attachment } from '../models/Attachment'

export interface IAttachmentStore {
    get(documentID: string): Promise<Attachment[]>
    create(Attachment: Attachment): Promise<void>
    delete(id: string): Promise<void>
}
