import type { UserSelection } from '../types'
import { canonicalizeSelection } from './selection'

export const createStableHash = (value: string): string => {
  let hash = 0x811c9dc5

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }

  return (hash >>> 0).toString(16).padStart(8, '0')
}

export const createSelectionHash = (selection: UserSelection): string => {
  const canonical = canonicalizeSelection(selection)
  return createStableHash(
    `${canonical.rulesVersion}|${canonical.toolIds.join(',')}|${canonical.captainId}`,
  )
}

export const selectStableVariant = <T>(variants: readonly T[], hash: string): T => {
  if (variants.length === 0) {
    throw new Error('候选内容不能为空')
  }

  const index = Number.parseInt(hash.slice(-8), 16) % variants.length
  return variants[index] as T
}

