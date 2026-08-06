import { MAX_SELECTED_TOOLS, MIN_SELECTED_TOOLS, RULES_VERSION } from '../config/dimensions'
import type { ToolDefinition, UserSelection } from '../types'

export const canonicalizeSelection = (selection: UserSelection): UserSelection => ({
  rulesVersion: selection.rulesVersion,
  toolIds: [...selection.toolIds].sort(),
  captainId: selection.captainId,
})

export const validateSelection = (
  selection: UserSelection,
  toolById: ReadonlyMap<string, ToolDefinition>,
): ToolDefinition[] => {
  if (selection.rulesVersion !== RULES_VERSION) {
    throw new Error(`不支持的规则版本：${selection.rulesVersion}`)
  }

  if (selection.toolIds.length < MIN_SELECTED_TOOLS) {
    throw new Error(`至少需要选择${MIN_SELECTED_TOOLS}款工具`)
  }

  if (selection.toolIds.length > MAX_SELECTED_TOOLS) {
    throw new Error(`最多只能选择${MAX_SELECTED_TOOLS}款工具`)
  }

  if (new Set(selection.toolIds).size !== selection.toolIds.length) {
    throw new Error('工具列表中存在重复项')
  }

  const selectedTools = selection.toolIds.map((id) => {
    const selectedTool = toolById.get(id)
    if (!selectedTool) {
      throw new Error(`未知工具：${id}`)
    }
    return selectedTool
  })

  if (!selection.captainId) {
    throw new Error('必须指定一款本命工具')
  }

  if (!selection.toolIds.includes(selection.captainId)) {
    throw new Error('本命工具必须来自已选工具')
  }

  return selectedTools
}

