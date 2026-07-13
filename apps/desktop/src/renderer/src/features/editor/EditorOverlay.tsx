import { OverlayType, useOverlay } from '@renderer/providers'
import { FindOverlay, QuickOpenOverlay } from '..'

export function EditorOverlay() {
    const { activeOverlay } = useOverlay()
    return <>
        {activeOverlay === OverlayType.QuickOpen && <QuickOpenOverlay />}
        {activeOverlay === OverlayType.Find && <FindOverlay />}
    </>
}
