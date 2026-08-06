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
  it('contains 31 reachable special titles with three verdict variants each', () => {
    expect(TITLE_RULES).toHaveLength(31)
    expect(new Set(TITLE_RULES.map((rule) => rule.id))).toHaveLength(31)
    expect(TITLE_RULES.every((rule) => rule.verdicts.length >= 3)).toBe(true)
  })

  it.each([
    [selection(['codex', 'cursor', 'claude', 'n8n'], 'codex'), ['AI全栈包工头', '赛博工程总监', 'IDE常住人口']],
    [selection(['chatgpt', 'midjourney', 'seedance', 'runway', 'suno'], 'seedance'), ['一人内容制作公司', 'AI片场美术指导', 'AI片场导演']],
    [selection(['claude', 'perplexity', 'notebooklm', 'kimi'], 'notebooklm'), ['互联网资料考古学家', '文档堆里的侦探']],
    [selection(['deepseek', 'cursor', 'codex'], 'cursor'), ['IDE常住人口']],
  ])('generates an expected title family for a fixed lineup', (input, expectedTitles) => {
    expect(expectedTitles).toContain(generateProfile(input).title)
  })

  it.each([
    [selection(['cursor', 'github-copilot', 'windsurf'], 'cursor'), 'IDE常住人口'],
    [selection(['perplexity', 'notebooklm', 'kimi'], 'kimi'), '互联网资料考古学家'],
    [selection(['seedance', 'sora', 'veo'], 'seedance'), 'AI片场导演'],
    [selection(['midjourney', 'chatgpt-images', 'gemini-image'], 'midjourney'), '审美参数调教师'],
    [selection(['chatgpt', 'claude', 'gemini', 'deepseek', 'doubao', 'kimi', 'qwen', 'grok'], 'chatgpt'), '单赛道重装玩家'],
  ])('matches a representative user portrait to its precise title', (input, expectedTitle) => {
    expect(generateProfile(input).title).toBe(expectedTitle)
  })

  it('does not describe terminal coding agents as IDE residents', () => {
    expect(generateProfile(selection(['codex', 'claude-code', 'chatgpt'], 'claude-code')).title)
      .not.toBe('IDE常住人口')
  })

  it('requires a real research tool for the cyber clerk portrait', () => {
    const input = selection(['chatgpt', 'gemini', 'grok'], 'chatgpt')
    const context = buildProfileContext(input, validateSelection(input, TOOL_BY_ID))
    const cyberClerkRule = TITLE_RULES.find((rule) => rule.id === 'research-cyber-clerk')!
    expect(matchesTitleCondition(cyberClerkRule.condition, context)).toBe(false)
  })

  it('uses a single-dimension fallback when one capability clearly leads', () => {
    expect(generateProfile(selection(['metaso', 'perplexity', 'genspark', 'kimi', 'n8n'], 'metaso')).title)
      .toBe('研究驱动型AI玩家')
  })

  it.each([
    [selection(['codex', 'claude-code', 'cursor', 'github-copilot', 'perplexity', 'notebooklm', 'genspark', 'metaso'], 'codex'), '技术研究型玩家'],
    [selection(['codex', 'claude-code', 'cursor', 'github-copilot', 'midjourney', 'chatgpt-images', 'gemini-image', 'comfyui'], 'codex'), '创意开发型玩家'],
    [selection(['suno', 'udio', 'elevenlabs'], 'suno'), '赛博卧室制作人'],
  ])('preserves a professional or dual-professional identity', (input, expectedTitle) => {
    expect(generateProfile(input).title).toBe(expectedTitle)
  })

  it.each([
    [selection(['chatgpt', 'deepseek', 'doubao', 'codex', 'cursor', 'github-copilot'], 'cursor'), 'AI全栈包工头'],
    [selection(['chatgpt', 'deepseek', 'doubao', 'midjourney', 'chatgpt-images', 'gemini-image'], 'midjourney'), '审美参数调教师'],
    [selection(['chatgpt', 'deepseek', 'doubao', 'suno', 'udio'], 'suno'), '赛博卧室制作人'],
  ])('lets professional tools define a lineup built on common assistants', (input, expectedTitle) => {
    expect(generateProfile(input).title).toBe(expectedTitle)
  })

  it('does not call a general-plus-professional lineup a model panel', () => {
    const profile = generateProfile(selection([
      'chatgpt', 'claude', 'gemini', 'deepseek',
      'codex', 'cursor', 'github-copilot', 'windsurf',
    ], 'cursor'))
    expect(profile.title).not.toBe('模型横评区常驻嘉宾')
    expect(profile.title).toBe('AI全栈包工头')
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
