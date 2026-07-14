export const IPCChannels = {
    window: {
        minimize: 'window:minimize',
        maximize: 'window:maximize',
        close: 'window:close',
        isMaximized: 'window:isMaximized'
    },
    workspace: {
        ping: 'workspace:ping',
        create: 'workspace:create',
        open: 'workspace:open',
        getCurrent: 'workspace:getCurrent',
        close: 'workspace:close'
    },
    explorer: {
        getRootFolders: 'explorer:getRootFolders',
        getFolders: 'explorer:getFolders',
        getDocuments: 'explorer:getDocuments',
        createFolder: 'explorer:createFolder',
        createDocument: 'explorer:createDocument',
        renameFolder: 'explorer:renameFolder',
        renameDocument: 'explorer:renameDocument',
        deleteFolder: 'explorer:deleteFolder',
        deleteDocument: 'explorer:deleteDocument',
        moveFolder: 'explorer:moveFolder',
        moveDocument: 'explorer:moveDocument'
    },
    editor: {
        open: 'editor:open',
        save: 'editor:save',
        confirmClose: 'editor:confirmClose',
        saveSession: 'editor:saveSession',
        loadSession: 'editor:loadSession'
    }
}
