import {
  CAPTAIN_MULTIPLIER,
  DIMENSION_KEYS,
  DIMENSION_WEIGHTS,
  MAX_ADJUSTED_SCORE,
} from '../config/dimensions'
import type { DimensionKey, DimensionScores, ToolDefinition } from '../types'

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value))

export const calculateDimensionScore = (
  dimension: DimensionKey,
  selectedTools: readonly ToolDefinition[],
  captainId: string,
): number => {
  const topScores = selectedTools
    .map((selectedTool) =>
      selectedTool.dimensions[dimension] *
      (selectedTool.id === captainId ? CAPTAIN_MULTIPLIER : 1),
    )
    .sort((left, right) => right - left)
    .slice(0, DIMENSION_WEIGHTS.length)

  const effectiveScore = DIMENSION_WEIGHTS.reduce(
    (total, weight, index) => total + (topScores[index] ?? 0) * weight,
    0,
  )

  return clamp(Math.round((effectiveScore / MAX_ADJUSTED_SCORE) * 100), 0, 100)
}

export const calculateDimensionScores = (
  selectedTools: readonly ToolDefinition[],
  captainId: string,
): DimensionScores =>
  Object.fromEntries(
    DIMENSION_KEYS.map((dimension) => [
      dimension,
      calculateDimensionScore(dimension, selectedTools, captainId),
    ]),
  ) as DimensionScores

export const rankDimensions = (dimensionScores: DimensionScores): DimensionKey[] =>
  [...DIMENSION_KEYS].sort(
    (left, right) =>
      dimensionScores[right] - dimensionScores[left] ||
      DIMENSION_KEYS.indexOf(left) - DIMENSION_KEYS.indexOf(right),
  )

