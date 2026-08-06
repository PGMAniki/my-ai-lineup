import type { DimensionKey } from '../types'

export const DIMENSION_KEYS = [
  'expression',
  'research',
  'coding',
  'image',
  'media',
  'automation',
] as const satisfies readonly DimensionKey[]

export const DIMENSIONS: ReadonlyArray<{
  key: DimensionKey
  name: string
  shortName: string
}> = [
  { key: 'expression', name: '思考表达', shortName: '表达' },
  { key: 'research', name: '搜索研究', shortName: '研究' },
  { key: 'coding', name: '编程开发', shortName: '编程' },
  { key: 'image', name: '图像设计', shortName: '图像' },
  { key: 'media', name: '影音创作', shortName: '影音' },
  { key: 'automation', name: 'Agent自动化', shortName: '自动化' },
]

export const RULES_VERSION = 1
export const MIN_SELECTED_TOOLS = 3
export const MAX_SELECTED_TOOLS = 8
export const CAPTAIN_MULTIPLIER = 1.25
export const MAX_ADJUSTED_SCORE = 6.25
export const DIMENSION_WEIGHTS = [0.55, 0.3, 0.15] as const

