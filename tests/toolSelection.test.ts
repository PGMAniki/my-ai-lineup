import { describe, expect, it } from 'vitest'
import { useSelection, type SelectionStorage } from '../src/composables/useSelection'
import { TOOLS } from '../src/config/tools'
import { filterTools } from '../src/core/toolSearch'

class MemoryStorage implements SelectionStorage {
  private values = new Map<string, string>()

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value)
  }
}

describe('tool search', () => {
  it('searches names and aliases without case sensitivity', () => {
    expect(filterTools(TOOLS, 'nano banana', 'all').map((tool) => tool.id)).toEqual(['gemini-image'])
    expect(filterTools(TOOLS, 'KLING', 'all').map((tool) => tool.id)).toEqual(['kling'])
    expect(filterTools(TOOLS, '谷歌生图', 'image').map((tool) => tool.id)).toEqual(['gemini-image'])
    expect(filterTools(TOOLS, '微软Copilot', 'all').map((tool) => tool.id)).toEqual(['microsoft-copilot'])
    expect(filterTools(TOOLS, '拍我AI', 'video').map((tool) => tool.id)).toEqual(['pixverse'])
  })

  it('filters by category', () => {
    expect(filterTools(TOOLS, '', 'audio').map((tool) => tool.id)).toEqual(['suno', 'udio', 'elevenlabs'])
  })
})

describe('selection state', () => {
  it('enforces the eight-tool limit without replacing existing tools', () => {
    const selection = useSelection(new MemoryStorage())
    const firstEight = TOOLS.slice(0, 8).map((tool) => tool.id)
    firstEight.forEach((id) => selection.toggleTool(id))

    const result = selection.toggleTool(TOOLS[8]!.id)
    expect(result.changed).toBe(false)
    expect(result.message).toContain('最多只能有8个')
    expect(selection.selectedToolIds.value).toEqual(firstEight)
  })

  it('persists selections and restores only valid unique tool IDs', () => {
    const storage = new MemoryStorage()
    const first = useSelection(storage)
    first.toggleTool('chatgpt')
    first.toggleTool('codex')
    first.toggleTool('midjourney')

    const restored = useSelection(storage)
    expect(restored.selectedToolIds.value).toEqual(['chatgpt', 'codex', 'midjourney'])
    expect(restored.canGenerate.value).toBe(true)
  })

  it('removes a selected tool and updates minimum feedback', () => {
    const selection = useSelection(new MemoryStorage())
    selection.toggleTool('chatgpt')
    selection.toggleTool('claude')
    selection.toggleTool('gemini')
    expect(selection.canGenerate.value).toBe(true)

    selection.toggleTool('gemini')
    expect(selection.canGenerate.value).toBe(false)
    expect(selection.remainingRequired.value).toBe(1)
  })
})
