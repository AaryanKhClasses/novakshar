import { useEditor } from '@renderer/providers/EditorProvider'

export function StatusBar() {
    const { activeDocument } = useEditor()
    const statistics = activeDocument?.statistics

    return <div className="flex items-center justify-between border-t px-4 text-sm bg-tonal-alt text-text-alt border-tonal">
        <div className="flex gap-6">
            <span>Markdown</span>
            <span>UTF-8</span>
        </div>
        <div className="flex gap-6">
            <span>{statistics?.words ?? 0} words</span>
            <span>{statistics?.characters ?? 0} characters</span>
            <span>{statistics?.lines ?? 0} lines</span>
        </div>
    </div>
}
