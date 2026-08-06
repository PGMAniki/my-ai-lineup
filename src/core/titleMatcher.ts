import {
  DIMENSION_PAIR_TITLES,
  FALLBACK_VERDICTS,
  SINGLE_DIMENSION_TITLES,
} from '../config/titleRules'
import type {
  DimensionKey,
  ProfileContext,
  TitleCondition,
  TitleRule,
  ToolCategory,
} from '../types'

const includesEvery = (selectedIds: Set<string>, requiredIds: readonly string[]): boolean =>
  requiredIds.every((id) => selectedIds.has(id))

const inRange = (
  value: number,
  range: { exact?: number; min?: number; max?: number },
): boolean =>
  (range.exact === undefined || value === range.exact) &&
  (range.min === undefined || value >= range.min) &&
  (range.max === undefined || value <= range.max)

export const matchesTitleCondition = (
  condition: TitleCondition,
  context: ProfileContext,
): boolean => {
  const selectedIds = new Set(context.selection.toolIds)
  const scoreValues = Object.values(context.dimensionScores)
  const topGap =
    context.dimensionScores[context.primaryDimension] -
    context.dimensionScores[context.secondaryDimension]

  if (condition.requiredTools && !includesEvery(selectedIds, condition.requiredTools)) return false
  if (condition.anyToolGroups?.some((group) => !group.some((id) => selectedIds.has(id)))) return false
  if (condition.minimumMatches?.some(({ toolIds, count }) => toolIds.filter((id) => selectedIds.has(id)).length < count)) return false
  if (condition.captainIn && !condition.captainIn.includes(context.captain.id)) return false
  if (condition.primaryDimension && condition.primaryDimension !== context.primaryDimension) return false
  if (condition.secondaryDimension && condition.secondaryDimension !== context.secondaryDimension) return false
  if (condition.toolCount && !inRange(context.selectedTools.length, condition.toolCount)) return false

  const distinctCategoryCount = Object.values(context.categoryCounts).filter((count) => count > 0).length
  if (condition.distinctCategories && !inRange(distinctCategoryCount, condition.distinctCategories)) return false

  if (condition.minScores && Object.entries(condition.minScores).some(([key, minimum]) => context.dimensionScores[key as DimensionKey] < (minimum ?? 0))) return false
  if (condition.minCategoryCounts && Object.entries(condition.minCategoryCounts).some(([key, minimum]) => context.categoryCounts[key as ToolCategory] < (minimum ?? 0))) return false
  if (condition.allScoresAtLeast !== undefined && scoreValues.some((score) => score < condition.allScoresAtLeast!)) return false
  if (condition.minTopScore !== undefined && context.dimensionScores[context.primaryDimension] < condition.minTopScore) return false
  if (condition.maxScoreSpread !== undefined && Math.max(...scoreValues) - Math.min(...scoreValues) > condition.maxScoreSpread) return false
  if (condition.minTopGap !== undefined && topGap < condition.minTopGap) return false
  if (condition.maxTopGap !== undefined && topGap > condition.maxTopGap) return false

  if (condition.captainIsOnlyToolInCategory && context.categoryCounts[context.captain.category] !== 1) return false

  return true
}

export const findMatchingTitleRule = (
  rules: readonly TitleRule[],
  context: ProfileContext,
): TitleRule | undefined =>
  rules
    .map((item, index) => ({ item, index }))
    .sort((left, right) => right.item.priority - left.item.priority || left.index - right.index)
    .find(({ item }) => matchesTitleCondition(item.condition, context))?.item

export const createFallbackTitleRule = (context: ProfileContext): TitleRule => {
  const directKey = `${context.primaryDimension}:${context.secondaryDimension}`
  const reverseKey = `${context.secondaryDimension}:${context.primaryDimension}`
  const title =
    DIMENSION_PAIR_TITLES[directKey] ??
    DIMENSION_PAIR_TITLES[reverseKey] ??
    SINGLE_DIMENSION_TITLES[context.primaryDimension]

  return {
    id: `fallback-${directKey}`,
    title,
    priority: 0,
    condition: {},
    verdicts: [...FALLBACK_VERDICTS],
  }
}
