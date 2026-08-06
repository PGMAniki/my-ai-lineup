import { computed, ref } from 'vue'
import { MAX_SELECTED_TOOLS, MIN_SELECTED_TOOLS } from '../config/dimensions'
import { TOOL_BY_ID } from '../config/tools'
import { RULES_VERSION } from '../config/dimensions'
import type { UserSelection } from '../types'

export const SELECTION_STORAGE_KEY = 'ai-lineup:v1:selection'

export interface SelectionStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

interface StoredSelection {
  toolIds: string[]
  captainId?: string
}

export interface ToggleSelectionResult {
  changed: boolean
  message?: string
}

const getBrowserStorage = (): SelectionStorage | undefined => {
  if (typeof window === 'undefined') return undefined
  return window.localStorage
}

const loadStoredSelection = (storage?: SelectionStorage): StoredSelection => {
  if (!storage) return { toolIds: [] }

  try {
    const rawValue = storage.getItem(SELECTION_STORAGE_KEY)
    if (!rawValue) return { toolIds: [] }

    const parsedValue = JSON.parse(rawValue) as Partial<StoredSelection>
    const validToolIds = Array.isArray(parsedValue.toolIds)
      ? parsedValue.toolIds.filter(
          (id, index, values): id is string =>
            typeof id === 'string' && TOOL_BY_ID.has(id) && values.indexOf(id) === index,
        )
      : []

    return {
      toolIds: validToolIds.slice(0, MAX_SELECTED_TOOLS),
      captainId:
        typeof parsedValue.captainId === 'string' && validToolIds.includes(parsedValue.captainId)
          ? parsedValue.captainId
          : undefined,
    }
  } catch {
    return { toolIds: [] }
  }
}

export const useSelection = (storage: SelectionStorage | undefined = getBrowserStorage()) => {
  const initialSelection = loadStoredSelection(storage)
  const selectedToolIds = ref<string[]>(initialSelection.toolIds)
  const captainId = ref<string | undefined>(initialSelection.captainId)

  const persist = (): void => {
    if (!storage) return

    try {
      storage.setItem(
        SELECTION_STORAGE_KEY,
        JSON.stringify({ toolIds: selectedToolIds.value, captainId: captainId.value }),
      )
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
  }

  const isSelected = (toolId: string): boolean => selectedToolIds.value.includes(toolId)

  const toggleTool = (toolId: string): ToggleSelectionResult => {
    if (!TOOL_BY_ID.has(toolId)) {
      return { changed: false, message: '暂时无法选择这款工具。' }
    }

    if (isSelected(toolId)) {
      selectedToolIds.value = selectedToolIds.value.filter((id) => id !== toolId)
      if (captainId.value === toolId) captainId.value = undefined
      persist()
      return { changed: true }
    }

    if (selectedToolIds.value.length >= MAX_SELECTED_TOOLS) {
      return {
        changed: false,
        message: '队伍已经满员。真正离不开的AI，最多只能有8个。',
      }
    }

    selectedToolIds.value = [...selectedToolIds.value, toolId]
    persist()
    return { changed: true }
  }

  const clearSelection = (): void => {
    selectedToolIds.value = []
    captainId.value = undefined
    persist()
  }

  const setCaptain = (toolId: string): boolean => {
    if (!selectedToolIds.value.includes(toolId)) return false
    captainId.value = toolId
    persist()
    return true
  }

  const toUserSelection = (): UserSelection | undefined => {
    if (!canGenerate.value || !captainId.value) return undefined
    return {
      rulesVersion: RULES_VERSION,
      toolIds: [...selectedToolIds.value],
      captainId: captainId.value,
    }
  }

  const selectedTools = computed(() =>
    selectedToolIds.value.flatMap((id) => {
      const selectedTool = TOOL_BY_ID.get(id)
      return selectedTool ? [selectedTool] : []
    }),
  )
  const canGenerate = computed(() => selectedToolIds.value.length >= MIN_SELECTED_TOOLS)
  const remainingRequired = computed(() =>
    Math.max(0, MIN_SELECTED_TOOLS - selectedToolIds.value.length),
  )

  return {
    selectedToolIds,
    selectedTools,
    captainId,
    canGenerate,
    remainingRequired,
    isSelected,
    toggleTool,
    setCaptain,
    toUserSelection,
    clearSelection,
  }
}
