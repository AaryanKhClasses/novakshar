import { $createHeadingNode } from '@lexical/rich-text'
import { applyFormat$, applyListType$, convertSelectionToNode$, currentBlockType$, currentFormat$, currentListType$, insertThematicBreak$, IS_BOLD, IS_ITALIC, IS_STRIKETHROUGH, IS_UNDERLINE, useCellValue, useCellValues, usePublisher } from '@mdxeditor/editor'
import { $createParagraphNode } from 'lexical'

export function EditorToolbar() {
    const [currentFormat] = useCellValues(currentFormat$)
    const currentList = useCellValue(currentListType$)

    const applyFormat = usePublisher(applyFormat$)
    const insertThematicBreak = usePublisher(insertThematicBreak$)
    const applyListType = usePublisher(applyListType$)

    return <div className="h-full space-x-0.5">
        <ToolbarButton active={(currentFormat & IS_BOLD) !== 0} onClick={() => applyFormat('bold')} className="font-bold">B</ToolbarButton>
        <ToolbarButton active={(currentFormat & IS_ITALIC) !== 0} onClick={() => applyFormat('italic')} className="italic">I</ToolbarButton>
        <ToolbarButton active={(currentFormat & IS_UNDERLINE) !== 0} onClick={() => applyFormat('underline')} className="underline">U</ToolbarButton>
        <ToolbarButton active={(currentFormat & IS_STRIKETHROUGH) !== 0} onClick={() => applyFormat('strikethrough')} className="line-through">S</ToolbarButton>
        <Separator />
        <HeadingButton level={1} />
        <HeadingButton level={2} />
        <HeadingButton level={3} />
        <Separator />
        <ToolbarButton active={currentList === 'bullet'} onClick={() => applyListType('bullet')}>•</ToolbarButton>
        <ToolbarButton active={currentList === 'number'} onClick={() => applyListType('number')}>1.</ToolbarButton>
        <ToolbarButton onClick={() => insertThematicBreak()}>{'<br />'}</ToolbarButton>
    </div>
}

type ToolbarButtonProps = {
    children: React.ReactNode
    active?: boolean
    onClick: () => void
    className?: string
}

function ToolbarButton({ children, active, onClick, className }: ToolbarButtonProps) {
    return <button
        onClick={onClick}
        className={`px-3 py-2 hover:bg-explorer-hover rounded animate font-mono ${active ? 'bg-primary text-text-inverted hover:bg-secondary' : ''} ${className || ''}`}
    >{children}</button>
}

function Separator() {
    return <span className="border-l h-full border-border mx-2" />
}

function HeadingButton({ level }: { level: 1 | 2 | 3 }) {
    const convertSelectionToNode = usePublisher(convertSelectionToNode$)
    const currentBlockType = useCellValue(currentBlockType$)

    const isActive = currentBlockType === `h${level}`

    return <button
        onClick={() => {
            if(!currentBlockType.startsWith(`h${level}`)) convertSelectionToNode(() => $createHeadingNode(`h${level}`))
            else convertSelectionToNode(() => $createParagraphNode())
        }}
        className={`px-3 py-2 hover:bg-explorer-hover rounded animate font-mono ${isActive ? 'bg-primary text-text-inverted hover:bg-secondary' : ''}`}
    >H{level}</button>
}
