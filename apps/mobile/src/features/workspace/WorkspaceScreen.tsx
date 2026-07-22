import { faFileCirclePlus, faFolderPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { Modal } from '../../components'
import { useWorkspace } from '../../providers'
import { ExplorerTree } from './ExplorerTree'

export function WorkspaceScreen() {
    const { workspaceName, closeWorkspace, createDocument, createFolder, folders, documents } = useWorkspace()
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [modalType, setModalType] = useState<'document' | 'folder'>('document')
    const [name, setName] = useState('')

    const handleCreate = () => {
        if(modalType === 'document') createDocument(name)
        else createFolder(name)
        setShowCreateModal(false)
        setName('')
    }

    return <View className="flex-1 flex-col w-screen h-screen p-3 bg-explorer">
        <View className="flex flex-col items-start">
            <Text className="text-4xl font-bold text-text">Novakshar</Text>
            <Text className="mt-2 text-text-alt">{workspaceName}</Text>
        </View>
        <View className="h-px w-full bg-border my-2" />
        <View className="flex flex-row items-center justify-between">
            <Text className="text-text-alt mt-2 tracking-wider font-bold text-xl">EXPLORER</Text>
            <View className="flex flex-row items-center justify-center gap-2">
                <Pressable onPress={() => { setShowCreateModal(true); setModalType('document') }} className="bg-explorer-selected px-3 py-2 rounded-md border border-border">
                    <FontAwesomeIcon color="#8b949e" icon={faFileCirclePlus} />
                </Pressable>
                <Pressable onPress={() => { setShowCreateModal(true); setModalType('folder') }} className="bg-explorer-selected px-3 py-2 rounded-md border border-border">
                    <FontAwesomeIcon color="#8b949e" icon={faFolderPlus} />
                </Pressable>
            </View>
        </View>
        <View className="flex-1 my-2">
            <ExplorerTree folders={folders} documents={documents} />
        </View>
        <View className="h-px w-full bg-border my-2" />
        <Pressable onPress={closeWorkspace} className="bg-explorer-selected px-3 py-2 rounded-md w-full">
            <Text className="text-center text-danger">Close Workspace</Text>
        </Pressable>
        <Modal visible={showCreateModal} onClose={() => setShowCreateModal(false)} title={`Create New ${modalType === 'document' ? 'Document' : 'Folder'}`}>
            <View className="flex flex-col gap-2">
                <Text className="text-text-alt">Name</Text>
                <TextInput autoFocus value={name} onChangeText={setName} className="bg-explorer-hover border border-border focus:border-border-focus text-text-alt placeholder:text-text-alt px-3 py-2 rounded-md" placeholder={`Enter ${modalType === 'document' ? 'document' : 'folder'} name`} />
                <Pressable onPress={handleCreate} className="border border-border bg-explorer-hover items-center px-3 py-2 rounded-md w-full">
                    <Text className="text-text-alt">Create</Text>
                </Pressable>
            </View>
        </Modal>
    </View>
}
