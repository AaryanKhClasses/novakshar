export const DocumentQueries = {
    Get: 'SELECT * FROM documents WHERE id = @id;',
    GetAll: 'SELECT * FROM documents;',
    GetByFolder: 'SELECT * FROM documents WHERE folder_id = @folder_id;',
    GetRootDocuments: 'SELECT * FROM documents WHERE folder_id IS NULL;',
    InsertOrReplace: 'INSERT OR REPLACE INTO documents(id, folder_id, title, relative_path, favorite, deleted, created_at, updated_at) VALUES(@id, @folder_id, @title, @relative_path, @favorite, @deleted, @created_at, @updated_at);',
    Delete: 'DELETE FROM documents WHERE id = @id;'
} as const
