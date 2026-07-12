import { createContext, PropsWithChildren, useContext, useState } from 'react'

export enum OverlayType {
    None, QuickOpen, Find, Replace, GotoLine, CommandPalette, GlobalSearch
}

interface OverlayContextValue {
    activeOverlay: OverlayType
    showOverlay(type: OverlayType): void
    hideOverlay(): void
    toggleOverlay(type: OverlayType): void
}

const OverlayContext = createContext<OverlayContextValue | null>(null)

export function OverlayProvider({ children }: PropsWithChildren) {
    const [activeOverlay, setActiveOverlay] = useState<OverlayType>(OverlayType.None)

    const showOverlay = (type: OverlayType) => setActiveOverlay(type)
    const hideOverlay = () => setActiveOverlay(OverlayType.None)
    const toggleOverlay = (type: OverlayType) => {
        setActiveOverlay(prev => prev === type ? OverlayType.None : type)
    }

    const value = {
        activeOverlay,
        showOverlay,
        hideOverlay,
        toggleOverlay
    }

    return <OverlayContext.Provider value={value}>
        {children}
    </OverlayContext.Provider>
}

export function useOverlay() {
    const context = useContext(OverlayContext)
    if(!context) throw new Error('Overlay Provider is not available.')
    return context
}
