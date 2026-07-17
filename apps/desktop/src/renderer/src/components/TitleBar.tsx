import { faWindowMaximize, faWindowRestore } from '@fortawesome/free-regular-svg-icons'
import { faMinus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OverlayType, useEditor, useExplorer, useOverlay, useView, useWorkspace } from '@renderer/providers'
import { useEffect, useMemo, useRef, useState } from 'react'

interface MenuItem {
    label: string
    shortcut?: string
    enabled?: boolean
    separator?: boolean
    action?: () => unknown
}

interface MenuDefinition {
    title: string
    items: MenuItem[]
}

type MenuActionKey = 'createWorkspace' | 'openWorkspace' | 'createDocument' | 'quickOpenDocument' | 'saveDocument' | 'closeDocument' | 'closeWindow' |
    'find' | 'replace' |
    'toggleZenMode' | 'toggleFocusMode' |
    'toggleSync' | 'syncNow'

interface MenuItemDefinition {
    label: string
    shortcut?: string
    enabled?: boolean
    separator?: boolean
    action?: MenuActionKey
}

interface MenuDefinitionTemplate {
    title: string
    items: MenuItemDefinition[]
}

const MENU_DEFINITIONS: MenuDefinitionTemplate[] = [
    {
        title: 'File',
        items: [
            { label: 'New Workspace', shortcut: 'Ctrl+Shift+N', action: 'createWorkspace' },
            { label: 'Open Workspace', shortcut: 'Ctrl+Shift+O', action: 'openWorkspace' },
            { label: 'New Document', shortcut: 'Ctrl+N', action: 'createDocument' },
            { label: 'Quick Open', shortcut: 'Ctrl+P', action: 'quickOpenDocument' },
            { separator: true, label: '' },
            { label: 'Save', shortcut: 'Ctrl+S', action: 'saveDocument' },
            { label: 'Save As', shortcut: 'Ctrl+Shift+S', enabled: false },
            { separator: true, label: '' },
            { label: 'Close Document', shortcut: 'Ctrl+W', action: 'closeDocument' },
            { label: 'Quit', shortcut: 'Alt+F4', action: 'closeWindow' },
            { separator: true, label: '' },
            { label: 'Settings', shortcut: 'Ctrl+,', enabled: false }
        ]
    },
    {
        title: 'Edit',
        items: [
            { label: 'Undo', shortcut: 'Ctrl+Z', enabled: false },
            { label: 'Redo', shortcut: 'Ctrl+Y', enabled: false },
            { separator: true, label: '' },
            { label: 'Find', shortcut: 'Ctrl+F', action: 'find' },
            { label: 'Replace', shortcut: 'Ctrl+H', action: 'replace' },
            { separator: true, label: '' },
            { label: 'Cut', shortcut: 'Ctrl+X', enabled: false },
            { label: 'Copy', shortcut: 'Ctrl+C', enabled: false },
            { label: 'Paste', shortcut: 'Ctrl+V', enabled: false },
            { label: 'Select All', shortcut: 'Ctrl+A', enabled: false }
        ]
    },
    {
        title: 'View',
        items: [
            { label: 'Toggle Zen Mode', shortcut: 'Ctrl+Alt+Z', action: 'toggleZenMode' },
            { label: 'Toggle Focus Mode', shortcut: 'Ctrl+Alt+F', action: 'toggleFocusMode' }
        ]
    },
    {
        title: 'Sync',
        items: [
            { label: await window.novakshar.sync.getState().then(state => state.enabled ? 'Disable Sync' : 'Enable Sync'), action: 'toggleSync' },
            { label: 'Sync Now', action: 'syncNow' }
        ]
    }
]

export function TitleBar() {
    const { workspaceName, createWorkspace, openWorkspace } = useWorkspace()
    const { saveDocument, closeDocument, activeDocumentID } = useEditor()
    const { createDocument } = useExplorer()
    const { toggleOverlay } = useOverlay()
    const { toggleZenMode, toggleFocusMode } = useView()

    const [maximized, setMaximized] = useState(false)
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    const handleMinimize = async() => await window.novakshar.window.minimize()
    const handleMaximize = async() => {
        await window.novakshar.window.maximize()
        const isMaximized = await window.novakshar.window.isMaximized()
        setMaximized(isMaximized)
    }
    const handleClose = async() => await window.novakshar.window.close()
    useEffect(() => {
        if(!openMenu) return

        const handlePointerDown = (event: MouseEvent) => {
            if(!menuRef.current?.contains(event.target as Node)) setOpenMenu(null)
        }

        document.addEventListener('mousedown', handlePointerDown)
        return () => document.removeEventListener('mousedown', handlePointerDown)
    }, [openMenu])

    const menus: MenuDefinition[] = useMemo(() => {
        const actions: Record<MenuActionKey, () => unknown> = {
            createWorkspace,
            openWorkspace,
            createDocument,
            saveDocument,
            closeDocument: () => void closeDocument(activeDocumentID ?? ''),
            closeWindow: () => window.novakshar.window.close(),
            find: () => toggleOverlay(OverlayType.Find),
            replace: () => toggleOverlay(OverlayType.Find, true),
            quickOpenDocument: () => toggleOverlay(OverlayType.QuickOpen),
            toggleZenMode,
            toggleFocusMode,
            toggleSync: async() => await window.novakshar.sync.toggle(),
            syncNow: async() => await window.novakshar.sync.syncNow()
        }

        return MENU_DEFINITIONS.map(menu => ({
            title: menu.title,
            items: menu.items.map(item => ({
                ...item,
                action: item.action ? actions[item.action] : undefined
            }))
        }))
    }, [activeDocumentID, closeDocument, createDocument, createWorkspace, saveDocument, toggleOverlay, toggleZenMode, toggleFocusMode, openWorkspace])

    return <div className="drag-region flex h-full items-center justify-between border-b border-border px-4 bg-title-bar text-text">
        <div className="flex items-center">
            <div className="flex items-center gap-2 px-4">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm font-medium">Novakshar</span>
            </div>
            <div className="h-5 w-px bg-border mx-1" />
            <div ref={menuRef} className="flex items-center">
                {menus.map(menu => <MenuButton key={menu.title} menu={menu} open={openMenu === menu.title} onOpen={() => setOpenMenu(menu.title)} onClose={() => setOpenMenu(null)} />)}
            </div>
        </div>
        <div className="flex items-center">
            {workspaceName && <span className="text-sm text-text-muted max-w-64 truncate mr-4">{workspaceName}</span>}
            <button onClick={handleMinimize} className="no-drag h-9 w-9 cursor-pointer text-text-alt rounded hover:bg-title-hover hover:text-text focus:bg-title-focus focus:text-text focus:outline-none animate"><FontAwesomeIcon icon={faMinus} /></button>
            <button onClick={handleMaximize} className="no-drag h-9 w-9 cursor-pointer text-text-alt rounded hover:bg-title-hover hover:text-text focus:bg-title-focus focus:text-text focus:outline-none animate">{maximized ? <FontAwesomeIcon icon={faWindowRestore} /> : <FontAwesomeIcon icon={faWindowMaximize} />}</button>
            <button onClick={handleClose} className="no-drag h-9 w-9 cursor-pointer text-text-alt rounded hover:bg-danger hover:text-text focus:bg-danger focus:text-text focus:outline-none animate"><FontAwesomeIcon icon={faXmark} /></button>
        </div>
    </div>
}

function DropdownItem({ item, onSelect }: { item: MenuItem, onSelect: () => void }) {
    if(item.separator) return <div className="border-t border-border my-1" />
    return <button
        disabled={item.enabled === false}
        onClick={() => {
            item.action?.()
            onSelect()
        }}
        className={`flex w-full items-center justify-between px-3 py-1.5 text-sm text-text-alt text-left animate ${item.enabled === false ? 'cursor-not-allowed opacity-50' : 'hover:bg-title-hover hover:text-text cursor-pointer focus:bg-title-focus focus:text-text focus:outline-none'}`}
    >
        <span>{item.label}</span>
        {item.shortcut && <span className="text-xs opacity-70">{item.shortcut}</span>}
    </button>
}

function DropdownMenu({ items, onSelect }: { items: MenuItem[], onSelect: () => void }) {
    return <div className="absolute top-full left-0 mt-1 min-w-56 rounded border border-border bg-title-bar shadow-lg z-50">
        {items.map(item => <DropdownItem key={item.label || 'separator'} item={item} onSelect={onSelect} />)}
    </div>
}

function MenuButton({ menu, open, onOpen, onClose }: { menu: MenuDefinition, open: boolean, onOpen: () => void, onClose: () => void }) {
    return <div className="relative no-drag"
        onClick={e => {
            e.stopPropagation()
            open ? onClose() : onOpen()
        }}
    >
        <button onClick={() => open ? onClose() : onOpen()} className={`h-9 cursor-pointer px-4 text-sm text-text-alt animate focus:outline-none focus:bg-title-focus focus:text-text ${open ? 'bg-title-hover text-text' : 'hover:bg-title-hover hover:text-text'}`}>{menu.title}</button>
        {open && <DropdownMenu items={menu.items} onSelect={onClose} />}
    </div>
}
