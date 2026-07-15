import { StatusBar, TitleBar } from '@renderer/components'
import { ExplorerPane, Tabs, WorkspaceContent } from '@renderer/features'
import { useView } from '@renderer/providers'

export function AppFrame() {
    const { mode } = useView()

    const showTitleBar = mode !== 'zen'
    const showExplorer = mode === 'normal'
    const showTabs = mode !== 'zen'
    const showStatusBar = mode !== 'zen'

    const gridColumns = mode === 'normal'
        ? 'grid-cols-[280px_1fr]' : 'grid-cols-[1fr]'

    const gridRows = mode === 'zen'
        ? 'grid-rows-[1fr]' : 'grid-rows-[40px_36px_1fr_32px]'
    
    const editorClassName = mode === 'normal'
        ? 'h-full w-full overflow-y-auto' : 'mx-auto max-w-5xl h-full w-full'

    return <div className={`grid h-screen w-screen bg-editor overflow-hidden ${gridColumns} ${gridRows}`}>
        {showTitleBar && <div className="col-span-full"><TitleBar /></div>}
        {showExplorer && <div className="row-span-3"><ExplorerPane /></div>}
        {showTabs && <Tabs />}
        <div className={editorClassName}><WorkspaceContent /></div>
        {showStatusBar && <StatusBar />}
    </div>
}
