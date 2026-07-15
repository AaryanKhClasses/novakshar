import { faImage, faSquareCheck } from '@fortawesome/free-regular-svg-icons'
import { faBold, faCode, faExclamation, faItalic, faLink, faListOl, faListUl, faMinus, faQuoteLeft, faRedo, faStrikethrough, faTable, faUnderline, faUndo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { applyFormat$, applyListType$, convertSelectionToNode$, currentBlockType$, currentFormat$, currentListType$, insertCodeBlock$, insertDirective$, insertThematicBreak$, IS_BOLD, IS_CODE, IS_ITALIC, IS_STRIKETHROUGH, IS_UNDERLINE, useCellValue, useCellValues, usePublisher } from '@mdxeditor/editor'
import { $createParagraphNode } from 'lexical'

export function EditorToolbar() {
    const [currentFormat] = useCellValues(currentFormat$)
    const currentList = useCellValue(currentListType$)
    const currentBlockType = useCellValue(currentBlockType$)

    const applyFormat = usePublisher(applyFormat$)
    const insertThematicBreak = usePublisher(insertThematicBreak$)
    const insertCodeBlock = usePublisher(insertCodeBlock$)
    const applyListType = usePublisher(applyListType$)
    const convertSelectionToNode = usePublisher(convertSelectionToNode$)
    const insertDirective = usePublisher(insertDirective$)

    return <div className="flex h-full space-x-0.5">
        <ToolbarButton onClick={() => {}}><FontAwesomeIcon className="text-inherit!" icon={faUndo} /></ToolbarButton>
        <ToolbarButton onClick={() => {}}><FontAwesomeIcon className="text-inherit!" icon={faRedo} /></ToolbarButton>
        <Separator />
        <ToolbarButton active={(currentFormat & IS_BOLD) !== 0} onClick={() => applyFormat('bold')}><FontAwesomeIcon className="text-inherit!" icon={faBold} /></ToolbarButton>
        <ToolbarButton active={(currentFormat & IS_ITALIC) !== 0} onClick={() => applyFormat('italic')}><FontAwesomeIcon className="text-inherit!" icon={faItalic} /></ToolbarButton>
        <ToolbarButton active={(currentFormat & IS_UNDERLINE) !== 0} onClick={() => applyFormat('underline')}><FontAwesomeIcon className="text-inherit!" icon={faUnderline} /></ToolbarButton>
        <ToolbarButton active={(currentFormat & IS_STRIKETHROUGH) !== 0} onClick={() => applyFormat('strikethrough')}><FontAwesomeIcon className="text-inherit!" icon={faStrikethrough} /></ToolbarButton>
        <Separator />
        <HeadingButton level={1} />
        <HeadingButton level={2} />
        <HeadingButton level={3} />
        <Separator />
        <ToolbarButton active={currentList === 'bullet'} onClick={() => applyListType('bullet')}><FontAwesomeIcon className="text-inherit!" icon={faListUl} /></ToolbarButton>
        <ToolbarButton active={currentList === 'number'} onClick={() => applyListType('number')}><FontAwesomeIcon className="text-inherit!" icon={faListOl} /></ToolbarButton>
        <ToolbarButton active={currentList === 'check'} onClick={() => applyListType('check')}><FontAwesomeIcon className="text-inherit!" icon={faSquareCheck} /></ToolbarButton>
        <Separator />
        <ToolbarButton onClick={insertThematicBreak}><FontAwesomeIcon className="text-inherit!" icon={faMinus} /></ToolbarButton>
        <ToolbarButton active={(currentFormat & IS_CODE) !== 0} onClick={() => insertCodeBlock({ language: 'text' })}><FontAwesomeIcon className="text-inherit!" icon={faCode} /></ToolbarButton>
        <ToolbarButton active={currentBlockType === 'quote'} onClick={() => convertSelectionToNode(() => $createQuoteNode())}><FontAwesomeIcon className="text-inherit!" icon={faQuoteLeft} /></ToolbarButton>
        <ToolbarButton onClick={() => { insertDirective({ type: 'containerDirective', name: 'note' }) }}><FontAwesomeIcon className="text-inherit!" icon={faExclamation} /></ToolbarButton>
        <Separator />
        <ToolbarButton onClick={() => {}}><FontAwesomeIcon className="text-inherit!" icon={faTable} /></ToolbarButton>
        <ToolbarButton onClick={() => {}}><FontAwesomeIcon className="text-inherit!" icon={faImage} /></ToolbarButton>
        <ToolbarButton onClick={() => {}}><FontAwesomeIcon className="text-inherit!" icon={faLink} /></ToolbarButton>
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
        className={`px-3 py-2 hover:bg-explorer-hover text-xs rounded animate font-mono ${active ? 'bg-primary text-text-inverted hover:bg-secondary' : ''} ${className || ''}`}
    >{children}</button>
}

function Separator() {
    return <span className="border-l h-8 border-border self-center mx-1" />
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
