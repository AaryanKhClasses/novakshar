export const FolderQueries = {
    Get: 'SELECT * FROM folders WHERE id = @id;',
    GetAll: 'SELECT * FROM folders;',
    GetChildren: 'SELECT * FROM folders WHERE parent_id = @parent_id;',
    GetRootFolders: 'SELECT * FROM folders WHERE parent_id IS NULL;',
    InsertOrReplace: 'INSERT OR REPLACE INTO folders(id, parent_id, name, color, icon, created_at, updated_at) VALUES(@id, @parent_id, @name, @color, @icon, @created_at, @updated_at);',
    Delete: 'DELETE FROM folders WHERE id = @id;'
} as const
