import { createContext, type PropsWithChildren } from 'react'

export interface ApplicationContextValue { }

export const ApplicationContext = createContext<ApplicationContextValue | null>(null)

export function ApplicationProvider({ children }: PropsWithChildren) {
    const value: ApplicationContextValue = { }
    return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>
}
