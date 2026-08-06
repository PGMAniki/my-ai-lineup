import type { ToolCategory, ToolDefinition } from '../types'

export type CategoryFilter = ToolCategory | 'all'

const normalizeSearchText = (value: string): string => value.trim().toLocaleLowerCase()

export const matchesToolSearch = (tool: ToolDefinition, query: string): boolean => {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return true

  return [tool.name, tool.shortName, ...tool.aliases]
    .map(normalizeSearchText)
    .some((candidate) => candidate.includes(normalizedQuery))
}

export const filterTools = (
  tools: readonly ToolDefinition[],
  query: string,
  category: CategoryFilter,
): ToolDefinition[] =>
  tools.filter(
    (tool) =>
      (category === 'all' || tool.category === category) && matchesToolSearch(tool, query),
  )

