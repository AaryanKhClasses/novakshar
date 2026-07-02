export const AttachmentQueries = {
    Get: 'SELECT * FROM attachments WHERE id = @id;',
    GetByDocument: 'SELECT * FROM attachments WHERE document_id = @documentId;',
    InsertOrReplace: 'INSERT OR REPLACE INTO attachments(id, document_id, filename, relative_path, mime_type, size, checksum, created_at, updated_at) VALUES(@id, @documentId, @filename, @relativePath, @mimeType, @size, @checksum, @createdAt, @updatedAt);',
    Delete: 'DELETE FROM attachments WHERE id = @id;'
} as const
