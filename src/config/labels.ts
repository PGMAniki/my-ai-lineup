import type { DimensionKey } from '../types'

export const DIMENSION_LABELS: Readonly<Record<DimensionKey, readonly string[]>> = {
  expression: ['表达驱动', '内容策划'],
  research: ['研究驱动', '资料考古'],
  coding: ['工程重度', '代码协作'],
  image: ['视觉优先', '审美调参'],
  media: ['内容工业化', '影音重度'],
  automation: ['自动化上瘾', 'Agent依赖'],
}

