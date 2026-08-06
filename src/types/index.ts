export type DimensionKey =
  | 'expression'
  | 'research'
  | 'coding'
  | 'image'
  | 'media'
  | 'automation'

export type ToolCategory =
  | 'general'
  | 'research'
  | 'coding'
  | 'image'
  | 'video'
  | 'audio'
  | 'agent'

export type DimensionScores = Record<DimensionKey, number>

export interface ToolDefinition {
  id: string
  name: string
  shortName: string
  category: ToolCategory
  description: string
  aliases: string[]
  dimensions: DimensionScores
  tags: string[]
}

export interface UserSelection {
  rulesVersion: number
  toolIds: string[]
  captainId: string
}

export interface TitleCondition {
  requiredTools?: string[]
  anyToolGroups?: string[][]
  minimumMatches?: Array<{ toolIds: string[]; count: number }>
  captainIn?: string[]
  minScores?: Partial<DimensionScores>
  primaryDimension?: DimensionKey
  secondaryDimension?: DimensionKey
  minCategoryCounts?: Partial<Record<ToolCategory, number>>
  toolCount?: { exact?: number; min?: number; max?: number }
  distinctCategories?: { min?: number; max?: number }
  allScoresAtLeast?: number
  minTopScore?: number
  maxScoreSpread?: number
  minTopGap?: number
  maxTopGap?: number
  captainIsOnlyToolInCategory?: boolean
  captainSupportsPrimaryDimension?: boolean
}

export interface TitleRule {
  id: string
  title: string
  priority: number
  condition: TitleCondition
  verdicts: string[]
}

export interface ProfileContext {
  selection: UserSelection
  selectedTools: ToolDefinition[]
  captain: ToolDefinition
  dimensionScores: DimensionScores
  rankedDimensions: DimensionKey[]
  primaryDimension: DimensionKey
  secondaryDimension: DimensionKey
  categoryCounts: Record<ToolCategory, number>
}

export interface GeneratedProfile {
  titleRuleId: string
  title: string
  verdict: string
  dimensionScores: DimensionScores
  primaryDimension: DimensionKey
  secondaryDimension: DimensionKey
  labels: string[]
  selectedTools: ToolDefinition[]
  captain: ToolDefinition
  resultHash: string
  rulesVersion: number
}
