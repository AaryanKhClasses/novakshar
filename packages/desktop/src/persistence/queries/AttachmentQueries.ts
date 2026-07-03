export const AttachmentQueries = {
    Get: 'SELECT * FROM attachments WHERE id = @id;',
    GetByDocument: 'SELECT * FROM attachments WHERE document_id = @document_id;',
    InsertOrReplace: 'INSERT OR REPLACE INTO attachments(id, document_id, filename, relative_path, mime_type, size, checksum, created_at, updated_at) VALUES(@id, @document_id, @filename, @relative_path, @mime_type, @size, @checksum, @created_at, @updated_at);',
    Delete: 'DELETE FROM attachments WHERE id = @id;'
} as const
