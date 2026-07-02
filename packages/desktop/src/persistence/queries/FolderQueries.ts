export const FolderQueries = {
    Get: 'SELECT * FROM folders WHERE id = @id;',
    GetAll: 'SELECT * FROM folders;',
    InsertOrReplace: 'INSERT OR REPLACE INTO folders(id, parent_id, name, color, icon, created_at, updated_at) VALUES(@id, @parentId, @name, @color, @icon, @createdAt, @updatedAt);',
    Delete: 'DELETE FROM folders WHERE id = @id;'
} as const
