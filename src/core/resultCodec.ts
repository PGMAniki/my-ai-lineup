import { TOOL_BY_ID } from '../config/tools'
import type { ToolDefinition, UserSelection } from '../types'
import { canonicalizeSelection, validateSelection } from './selection'

export interface ResultParams extends Record<string, string> {
  v: string
  t: string
  c: string
}

export type RawResultParams = Record<string, string | Array<string | null> | null | undefined>

const readSingleParam = (
  value: string | Array<string | null> | null | undefined,
  name: string,
): string => {
  if (Array.isArray(value)) throw new Error(`结果参数 ${name} 不能重复`)
  if (typeof value !== 'string' || !value.trim()) throw new Error(`结果链接缺少参数 ${name}`)
  return value.trim()
}

export const encodeResultParams = (selection: UserSelection): ResultParams => {
  validateSelection(selection, TOOL_BY_ID)
  const canonical = canonicalizeSelection(selection)

  return {
    v: String(canonical.rulesVersion),
    t: canonical.toolIds.join(','),
    c: canonical.captainId,
  }
}

export const decodeResultParams = (
  params: RawResultParams,
  toolById: ReadonlyMap<string, ToolDefinition> = TOOL_BY_ID,
): UserSelection => {
  const versionText = readSingleParam(params.v, 'v')
  const toolsText = readSingleParam(params.t, 't')
  const captainId = readSingleParam(params.c, 'c')
  const rulesVersion = Number(versionText)

  if (!Number.isInteger(rulesVersion) || rulesVersion < 1) {
    throw new Error(`无效的规则版本：${versionText}`)
  }

  const toolIds = toolsText.split(',').map((id) => id.trim())
  if (toolIds.some((id) => !id)) throw new Error('结果链接中包含空工具ID')

  const selection: UserSelection = { rulesVersion, toolIds, captainId }
  validateSelection(selection, toolById)
  return selection
}
