import { createContext, PropsWithChildren, useContext, useState } from 'react'

export type ViewMode = 'normal' | 'zen' | 'focus'

interface ViewContextValue {
    mode: ViewMode
    setMode(mode: ViewMode): void
    toggleZenMode(): void
    toggleFocusMode(): void
}

const ViewContext = createContext<ViewContextValue | null>(null)

export function ViewProvider({ children }: PropsWithChildren) {
    const [mode, setMode] = useState<ViewMode>('normal')

    const toggleZenMode = () => setMode(mode !== 'zen' ? 'zen' : 'normal')
    const toggleFocusMode = () => setMode(mode !== 'focus' ? 'focus' : 'normal')

    const value: ViewContextValue = {
        mode,
        setMode,
        toggleZenMode,
        toggleFocusMode
    }

    return <ViewContext.Provider value={value}>
        {children}
    </ViewContext.Provider>
}

export const useView = () => {
    const context = useContext(ViewContext)
    if(!context) throw new Error('View Provider is not available')
    return context
}
