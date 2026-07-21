import { View } from 'react-native'
import { WelcomeScreen } from '../components'
import { useWorkspace } from '../providers'

export function AppFrame() {
    const { isOpen } = useWorkspace()

    return <View>
        {!isOpen && <WelcomeScreen />}
    </View>
}
