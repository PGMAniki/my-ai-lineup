import { describe, expect, it } from 'vitest'
import { RULES_VERSION } from '../src/config/dimensions'
import { TOOL_BY_ID, TOOLS } from '../src/config/tools'
import { calculateDimensionScore, calculateDimensionScores, rankDimensions } from '../src/core/scoring'
import { validateSelection } from '../src/core/selection'
import { createSelectionHash, selectStableVariant } from '../src/core/stableHash'
import type { ToolDefinition, UserSelection } from '../src/types'

const selection = (toolIds: string[], captainId: string): UserSelection => ({
  rulesVersion: RULES_VERSION,
  toolIds,
  captainId,
})

describe('tool configuration', () => {
  it('contains 41 unique tools with valid dimension scores', () => {
    expect(TOOLS).toHaveLength(41)
    expect(new Set(TOOLS.map((tool) => tool.id))).toHaveLength(41)

    for (const tool of TOOLS) {
      expect(Object.values(tool.dimensions)).toHaveLength(6)
      expect(Object.values(tool.dimensions).every((score) => score >= 0 && score <= 5)).toBe(true)
    }
  })
})

describe('selection validation', () => {
  it('resolves a valid selection', () => {
    const resolved = validateSelection(selection(['codex', 'cursor', 'claude'], 'codex'), TOOL_BY_ID)
    expect(resolved.map((tool) => tool.id)).toEqual(['codex', 'cursor', 'claude'])
  })

  it.each([
    [selection(['codex', 'cursor'], 'codex'), '至少需要选择3款工具'],
    [selection(['chatgpt', 'claude', 'gemini', 'deepseek', 'doubao', 'kimi', 'qwen', 'codex', 'cursor'], 'codex'), '最多只能选择8款工具'],
    [selection(['codex', 'codex', 'cursor'], 'codex'), '工具列表中存在重复项'],
    [selection(['codex', 'cursor', 'missing'], 'codex'), '未知工具：missing'],
    [selection(['codex', 'cursor', 'claude'], ''), '必须指定一款本命工具'],
    [selection(['codex', 'cursor', 'claude'], 'n8n'), '本命工具必须来自已选工具'],
    [{ rulesVersion: 2, toolIds: ['codex', 'cursor', 'claude'], captainId: 'codex' }, '不支持的规则版本：2'],
  ])('rejects malformed selection', (input, message) => {
    expect(() => validateSelection(input, TOOL_BY_ID)).toThrow(message)
  })
})

describe('dimension scoring', () => {
  it('applies captain weighting and only uses the top three tools', () => {
    const selected = ['codex', 'cursor', 'claude', 'perplexity', 'midjourney'].map(
      (id) => TOOL_BY_ID.get(id) as ToolDefinition,
    )

    expect(calculateDimensionScore('coding', selected, 'codex')).toBe(89)

    const withLowScoringExtra = [...selected, TOOL_BY_ID.get('metaso') as ToolDefinition]
    expect(calculateDimensionScore('coding', withLowScoringExtra, 'codex')).toBe(89)
  })

  it('returns integer scores in the 0–100 range', () => {
    const selected = validateSelection(
      selection(['chatgpt', 'perplexity', 'codex', 'midjourney', 'seedance', 'coze'], 'chatgpt'),
      TOOL_BY_ID,
    )
    const result = calculateDimensionScores(selected, 'chatgpt')

    expect(Object.values(result).every(Number.isInteger)).toBe(true)
    expect(Object.values(result).every((score) => score >= 0 && score <= 100)).toBe(true)
  })

  it('uses the documented dimension order to break ties', () => {
    expect(rankDimensions({ expression: 80, research: 80, coding: 30, image: 20, media: 10, automation: 5 }).slice(0, 2)).toEqual(['expression', 'research'])
  })
})

describe('stable hash', () => {
  it('is independent from selected tool order', () => {
    const first = selection(['codex', 'cursor', 'claude'], 'codex')
    const second = selection(['claude', 'codex', 'cursor'], 'codex')
    expect(createSelectionHash(first)).toBe(createSelectionHash(second))
  })

  it('selects a deterministic variant', () => {
    const hash = createSelectionHash(selection(['codex', 'cursor', 'claude'], 'codex'))
    expect(selectStableVariant(['甲', '乙', '丙'], hash)).toBe(selectStableVariant(['甲', '乙', '丙'], hash))
    expect(() => selectStableVariant([], hash)).toThrow('候选内容不能为空')
  })
})
