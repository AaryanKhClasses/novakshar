import { StatusBar, TitleBar, ToolBar } from '@renderer/components'
import { WorkspaceContent, ExplorerPane, Tabs } from '@renderer/features'

export function AppFrame() {
    return <div className="grid h-screen w-screen overflow-hidden grid-cols-[280px_1fr] grid-rows-[40px_40px_36px_1fr_24px]">
        <div className="col-span-2"><TitleBar /></div>
        <div className="col-span-2"><ToolBar /></div>
        <div className="row-span-3 border-r"><ExplorerPane /></div>
        <Tabs />
        <WorkspaceContent />
        <StatusBar />
    </div>
}
