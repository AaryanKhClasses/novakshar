export interface MarkdownStatistics {
    words: number
    characters: number
    lines: number
}

export function calculateMarkdownStatistics(markdown: string): MarkdownStatistics {
    const characters = markdown.length
    const lines = markdown.length === 0 ? 1 : markdown.split(/\r\n|\r|\n/).length
    const words = markdown.trim().length === 0 ? 0 : markdown.trim().split(/\s+/).length
    return { words, characters, lines }
}
