import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { useApplication, useWorkspace, WorkspaceDTO } from '../../providers'
import { Modal } from '../../components'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'

export function WelcomeScreen() {
    const { createWorkspace, openWorkspace } = useWorkspace()
    const { workspaces } = useApplication()
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [workspaceName, setWorkspaceName] = useState('')

    const handleCreateWorkspace = async() => {
        if(workspaceName.trim() === '') return
        await createWorkspace(workspaceName)
        setShowCreateModal(false)
        setWorkspaceName('')
    }

    return <View className="flex-1 items-center justify-center bg-editor">
        <Text className="text-4xl font-bold text-text">Welcome to Novakshar</Text>
        <Text className="mt-2 text-text-muted">A Fully Customizable Local-First Markdown Editor</Text>
        <Pressable onPress={() => setShowCreateModal(true)} className="w-[80%] items-center mt-5 px-4 py-2 rounded-xl bg-editor-toolbar border border-border">
            <Text className="text-text">Create Workspace</Text>
        </Pressable>
        <View className="flex flex-row items-center justify-center gap-2 w-full my-4">
            <View className="w-[30%] h-px bg-border" />
            <Text className="text-text-alt text-center">EXISTING</Text>
            <View className="w-[30%] h-px bg-border" />
        </View>
        <View className="w-full text-start flex items-center">
            {workspaces.length === 0
                ? <Text className="text-center text-text-muted">No workspaces found.</Text>
                : workspaces.map((workspace: WorkspaceDTO) => <Pressable onPress={() => openWorkspace(workspace.path)}
                    key={workspace.name}
                    className="p-2 w-[80%] bg-editor-toolbar border border-border rounded-lg mt-2 flex flex-row items-center gap-4"
                >
                    <FontAwesomeIcon color="#8b949e" icon={faFolderOpen} />
                    <Text className="text-text">{workspace.name}</Text>
                </Pressable>)}
        </View>
        <Modal visible={showCreateModal} title="Create Workspace" onClose={() => setShowCreateModal(false)}>
            <TextInput placeholder="Workspace Name" value={workspaceName} onChangeText={setWorkspaceName} className="border border-border focus:border-border-focus rounded-lg p-2 text-text placeholder:text-text" />
            <View className="mt-2 flex-row items-center justify-center gap-2">
                <Pressable onPress={() => setShowCreateModal(false)} className="mt-4 w-1/2 items-center px-4 py-2 rounded-xl bg-editor-toolbar border border-border">
                    <Text className="text-text">Cancel</Text>
                </Pressable>
                <Pressable disabled={workspaceName.trim() === ''} onPress={handleCreateWorkspace} className="mt-4 w-1/2 items-center px-4 py-2 rounded-xl bg-editor-toolbar border border-border disabled:opacity-50">
                    <Text className="text-text">Create</Text>
                </Pressable>
            </View>
        </Modal>
    </View>
}
