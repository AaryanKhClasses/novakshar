export const DocumentQueries = {
    Get: 'SELECT * FROM documents WHERE id = @id AND deleted = 0;',
    GetAll: 'SELECT * FROM documents WHERE deleted = 0;',
    GetByFolder: 'SELECT * FROM documents WHERE folder_id = @folder_id AND deleted = 0;',
    GetRootDocuments: 'SELECT * FROM documents WHERE folder_id IS NULL AND deleted = 0;',
    InsertOrReplace: 'INSERT OR REPLACE INTO documents(id, folder_id, title, relative_path, favorite, deleted, created_at, updated_at) VALUES(@id, @folder_id, @title, @relative_path, @favorite, @deleted, @created_at, @updated_at);',
    Delete: 'DELETE FROM documents WHERE id = @id AND deleted = 0;'
} as const
