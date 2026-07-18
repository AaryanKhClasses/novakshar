export const FolderQueries = {
    Get: 'SELECT * FROM folders WHERE id = ?;',
    GetAll: 'SELECT * FROM folders;',
    GetChildren: 'SELECT * FROM folders WHERE parent_id IS ?;',
    GetRootFolders: 'SELECT * FROM folders WHERE parent_id IS NULL;',
    InsertOrReplace: 'INSERT OR REPLACE INTO folders(id, parent_id, name, color, icon, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?);',
    Delete: 'DELETE FROM folders WHERE id = ?;'
} as const
