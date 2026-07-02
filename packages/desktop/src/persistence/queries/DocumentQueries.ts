export const DocumentQueries = {
    Get: 'SELECT * FROM documents WHERE id = @id;',
    GetAll: 'SELECT * FROM documents;',
    GetByFolder: 'SELECT * FROM documents WHERE folder_id = @folderId;',
    InsertOrReplace: 'INSERT OR REPLACE INTO documents(id, folder_id, title, relative_path, favorite, deleted, created_at, updated_at) VALUES(@id, @folderId, @title, @relativePath, @favorite, @deleted, @createdAt, @updatedAt);',
    Delete: 'DELETE FROM documents WHERE id = @id;'
} as const
