import { DIMENSION_LABELS } from '../config/labels'
import { TOOL_BY_ID } from '../config/tools'
import { TITLE_RULES } from '../config/titleRules'
import type {
  GeneratedProfile,
  ProfileContext,
  ToolCategory,
  ToolDefinition,
  UserSelection,
} from '../types'
import { calculateDimensionScores, rankDimensions } from './scoring'
import { validateSelection } from './selection'
import { createSelectionHash, selectStableVariant } from './stableHash'
import { createFallbackTitleRule, findMatchingTitleRule } from './titleMatcher'

const EMPTY_CATEGORY_COUNTS: Record<ToolCategory, number> = {
  general: 0,
  research: 0,
  coding: 0,
  image: 0,
  video: 0,
  audio: 0,
  agent: 0,
}

export const buildProfileContext = (
  selection: UserSelection,
  selectedTools: ToolDefinition[],
): ProfileContext => {
  const captain = selectedTools.find((tool) => tool.id === selection.captainId)
  if (!captain) throw new Error('本命工具必须来自已选工具')

  const dimensionScores = calculateDimensionScores(selectedTools, selection.captainId)
  const rankedDimensions = rankDimensions(dimensionScores)
  const categoryCounts = selectedTools.reduce<Record<ToolCategory, number>>(
    (counts, selectedTool) => ({
      ...counts,
      [selectedTool.category]: counts[selectedTool.category] + 1,
    }),
    { ...EMPTY_CATEGORY_COUNTS },
  )

  return {
    selection,
    selectedTools,
    captain,
    dimensionScores,
    rankedDimensions,
    primaryDimension: rankedDimensions[0]!,
    secondaryDimension: rankedDimensions[1]!,
    categoryCounts,
  }
}

export const generateProfile = (
  selection: UserSelection,
  toolById: ReadonlyMap<string, ToolDefinition> = TOOL_BY_ID,
): GeneratedProfile => {
  const selectedTools = validateSelection(selection, toolById)
  const context = buildProfileContext(selection, selectedTools)
  const matchedRule = findMatchingTitleRule(TITLE_RULES, context) ?? createFallbackTitleRule(context)
  const resultHash = createSelectionHash(selection)

  return {
    titleRuleId: matchedRule.id,
    title: matchedRule.title,
    verdict: selectStableVariant(matchedRule.verdicts, resultHash),
    dimensionScores: context.dimensionScores,
    primaryDimension: context.primaryDimension,
    secondaryDimension: context.secondaryDimension,
    labels: [
      DIMENSION_LABELS[context.primaryDimension][0],
      DIMENSION_LABELS[context.secondaryDimension][1],
    ],
    selectedTools,
    captain: context.captain,
    resultHash,
    rulesVersion: selection.rulesVersion,
  }
}

