import { Animated, View, useWindowDimensions } from 'react-native'
import { Editor, ExplorerPane } from '..'
import { useWorkspace } from '../../providers'
import { useLayoutEffect, useRef } from 'react'

export function WorkspaceScreen() {
    const { workspaceView } = useWorkspace()
    const { width } = useWindowDimensions()

    const translateX = useRef(new Animated.Value(0)).current
    useLayoutEffect(() => {
        translateX.setValue(workspaceView === 'explorer' ? -width : width)
        Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
        }).start()
    }, [workspaceView, translateX, width])

    return <View className="flex-1 overflow-hidden">
        <Animated.View style={{
            flex: 1,
            width,
            transform: [{ translateX }]
        }}>
            {workspaceView === 'explorer' ? <ExplorerPane /> : <Editor />}
        </Animated.View>
    </View>
}
