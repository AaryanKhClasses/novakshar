export const IPCChannels = {
    workspace: {
        ping: 'workspace:ping',
        create: 'workspace:create',
        open: 'workspace:open',
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
        deleteDocument: 'explorer:deleteDocument'
    }
}
