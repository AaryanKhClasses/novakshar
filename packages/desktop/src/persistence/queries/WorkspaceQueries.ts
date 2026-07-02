export const WorkspaceQueries = {
    Exists: 'SELECT COUNT(*) FROM workspaces;',
    Get: 'SELECT * FROM workspaces LIMIT 1;',
    InsertOrReplace: 'INSERT OR REPLACE INTO workspaces(id, name, root_path, version, created_at, updated_at) VALUES(@id, @name, @rootPath, @version, @createdAt, @updatedAt);',
    Delete: 'DELETE FROM workspaces;'
} as const
