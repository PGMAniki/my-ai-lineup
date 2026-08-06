import { describe, expect, it } from 'vitest'
import { RULES_VERSION } from '../src/config/dimensions'
import { TOOL_BY_ID } from '../src/config/tools'
import { TITLE_RULES } from '../src/config/titleRules'
import { buildProfileContext, generateProfile } from '../src/core/profileGenerator'
import { validateSelection } from '../src/core/selection'
import { matchesTitleCondition } from '../src/core/titleMatcher'
import type { UserSelection } from '../src/types'

const selection = (toolIds: string[], captainId: string): UserSelection => ({
  rulesVersion: RULES_VERSION,
  toolIds,
  captainId,
})

describe('title rules', () => {
  it('contains 30 special titles with three verdict variants each', () => {
    expect(TITLE_RULES).toHaveLength(30)
    expect(new Set(TITLE_RULES.map((rule) => rule.id))).toHaveLength(30)
    expect(TITLE_RULES.every((rule) => rule.verdicts.length >= 3)).toBe(true)
  })

  it.each([
    [selection(['codex', 'cursor', 'claude', 'n8n'], 'codex'), ['AI全栈包工头', '赛博工程总监', 'IDE常住人口']],
    [selection(['chatgpt', 'midjourney', 'seedance', 'runway', 'suno'], 'seedance'), ['一人内容制作公司', 'AI片场美术指导', 'AI片场导演']],
    [selection(['claude', 'perplexity', 'notebooklm', 'kimi'], 'notebooklm'), ['互联网资料考古学家', '文档堆里的侦探']],
    [selection(['deepseek', 'cursor', 'codex'], 'cursor'), ['AI全栈包工头']],
  ])('generates an expected title family for a fixed lineup', (input, expectedTitles) => {
    expect(expectedTitles).toContain(generateProfile(input).title)
  })
})

describe('profile generation', () => {
  it('is stable regardless of tool order', () => {
    const first = generateProfile(selection(['codex', 'cursor', 'claude', 'n8n'], 'codex'))
    const second = generateProfile(selection(['n8n', 'claude', 'codex', 'cursor'], 'codex'))

    expect({
      title: first.title,
      verdict: first.verdict,
      scores: first.dimensionScores,
      labels: first.labels,
      hash: first.resultHash,
    }).toEqual({
      title: second.title,
      verdict: second.verdict,
      scores: second.dimensionScores,
      labels: second.labels,
      hash: second.resultHash,
    })
  })

  it('returns a complete generated profile', () => {
    const profile = generateProfile(
      selection(['chatgpt', 'perplexity', 'codex', 'midjourney', 'seedance', 'coze'], 'chatgpt'),
    )

    expect(profile.title).toBeTruthy()
    expect(profile.verdict).toBeTruthy()
    expect(profile.labels).toHaveLength(2)
    expect(profile.selectedTools).toHaveLength(6)
    expect(profile.captain.id).toBe('chatgpt')
    expect(profile.rulesVersion).toBe(1)
  })

  it('applies the minimalist rule using the highest dimension, not a fixed dimension', () => {
    const input = selection(['deepseek', 'kimi', 'perplexity'], 'deepseek')
    const context = buildProfileContext(input, validateSelection(input, TOOL_BY_ID))
    const minimalistRule = TITLE_RULES.find((rule) => rule.id === 'structure-minimalist')!
    expect(context.dimensionScores[context.primaryDimension]).toBeGreaterThanOrEqual(75)
    expect(matchesTitleCondition(minimalistRule.condition, context)).toBe(true)
  })
})
