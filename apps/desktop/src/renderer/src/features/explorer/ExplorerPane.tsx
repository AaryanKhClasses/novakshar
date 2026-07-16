import { ExplorerTabs, useExplorer } from '@renderer/providers'
import { ExplorerFilesTab, ExplorerOutlineTab } from '..'

export function ExplorerPane() {
    const { explorerTab, setExplorerTab } = useExplorer()

    return <div className="h-full py-2 flex flex-col gap-1 bg-explorer text-text-muted border-r border-border">
        <div className="flex items-center border-b border-border bg-editor text-sm text-text-alt overflow-x-auto">
            {ExplorerTabs.map(tab => <div
                onClick={() => setExplorerTab(tab)}
                className={`font-medium text-text-alt uppercase animate px-4 py-1 text-sm tracking-wide cursor-pointer ${tab === explorerTab ? 'bg-explorer hover:bg-explorer-selected text-text border-b-2 border-border-focus' : 'hover:bg-explorer-hover hover:text-text'}`} key={tab}
            >
                {tab}
            </div>)}
        </div>
        {explorerTab === 'files' && <ExplorerFilesTab />}
        {explorerTab === 'outline' && <ExplorerOutlineTab />}
    </div>
}
