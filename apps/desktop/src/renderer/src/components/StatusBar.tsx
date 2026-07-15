import { useEditor } from '@renderer/providers'

export function StatusBar() {
    const { activeDocument } = useEditor()
    const statistics = activeDocument?.statistics

    if(!activeDocument) return <div className="bg-editor"></div>
    return <div className="flex items-center justify-between border-t border-border bg-status-bar px-4 text-sm text-text-alt">
        <div className="flex gap-6">
            <span className="hover:text-text animate">Markdown</span>
            <span className="hover:text-text animate">UTF-8</span>
        </div>
        <div className="flex gap-6">
            <span className="hover:text-text animate">{statistics?.words ?? 0} words</span>
            <span className="hover:text-text animate">{statistics?.characters ?? 0} characters</span>
            <span className="hover:text-text animate">{statistics?.readingTime ?? 0} min read</span>
            <span className="hover:text-text animate">{statistics?.lines ?? 0} lines</span>
        </div>
    </div>
}
