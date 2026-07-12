import { OverlayType, useOverlay } from '@renderer/providers'
import { QuickOpenOverlay } from '..'

export function EditorOverlay() {
    const { activeOverlay } = useOverlay()
    return <>
        {activeOverlay === OverlayType.QuickOpen && <QuickOpenOverlay />}
    </>
}
