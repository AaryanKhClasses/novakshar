import { Modal as RNModal, View, Text, Pressable } from 'react-native'

interface ModalProps {
    visible: boolean
    title: string
    children: React.ReactNode
    onClose: () => void
}

export function Modal({ visible, title, children, onClose }: ModalProps) {
    return <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <Pressable onPress={onClose} className="flex-1 justify-center items-center bg-black/50">
            <Pressable onPress={(e) => e.stopPropagation()} className="bg-editor-toolbar border border-border rounded-lg p-4 w-11/12 max-w-md">
                <Text className="text-text text-xl font-bold">{title}</Text>
                <View className="mt-4">
                    {children}
                </View>
            </Pressable>
        </Pressable>
    </RNModal>
}
