import type { DimensionKey, TitleCondition, TitleRule } from '../types'

const verdicts = (focus: string): string[] => [
  `你的阵容已经把${focus}变成了默认工作方式。`,
  `别人还在挑工具，你已经给${focus}排好了值班表。`,
  `这套组合最明显的不是工具多，而是${focus}已经形成流程。`,
]

const rule = (
  id: string,
  title: string,
  priority: number,
  condition: TitleCondition,
  focus: string,
): TitleRule => ({ id, title, priority, condition, verdicts: verdicts(focus) })

export const TITLE_RULES: readonly TitleRule[] = [
  rule('dev-ai-contractor', 'AI全栈包工头', 1000, { minimumMatches: [{ toolIds: ['codex', 'claude-code', 'cursor'], count: 2 }], minScores: { automation: 70 } }, '代码智能体协作'),
  rule('dev-cyber-director', '赛博工程总监', 990, { minScores: { coding: 80, automation: 80 }, minCategoryCounts: { coding: 2 } }, '工程和自动化'),
  rule('dev-ide-resident', 'IDE常住人口', 980, { captainIn: ['cursor', 'github-copilot', 'windsurf'] }, '编辑器里的长期生活'),
  rule('dev-workflow-wirer', '工作流接线员', 970, { minimumMatches: [{ toolIds: ['dify', 'coze', 'n8n'], count: 2 }] }, '工作流接线'),
  rule('dev-node-alchemist', '节点炼金术士', 960, { requiredTools: ['comfyui'], anyToolGroups: [['n8n', 'dify', 'coze']] }, '节点工作流'),
  rule('dev-startup-cto', '一句话创业公司CTO', 950, { requiredTools: ['replit-agent'], anyToolGroups: [['codex', 'claude-code']] }, '一句话开发'),
  rule('dev-agent-breeder', '代码智能体饲养员', 940, { minCategoryCounts: { coding: 3 } }, '代码智能体'),

  rule('research-web-archaeologist', '互联网资料考古学家', 900, { requiredTools: ['perplexity', 'notebooklm'] }, '资料挖掘'),
  rule('research-universe-admin', '资料宇宙管理员', 910, { requiredTools: ['perplexity', 'notebooklm', 'genspark'] }, '资料宇宙管理'),
  rule('research-cyber-clerk', '知识型赛博文官', 890, { minScores: { expression: 80, research: 80 }, minCategoryCounts: { research: 1 } }, '知识整理与表达'),
  rule('research-model-panelist', '模型横评区常驻嘉宾', 880, { minCategoryCounts: { general: 4 } }, '多模型会诊'),
  rule('research-multi-model-doctor', '多模型会诊专家', 920, { requiredTools: ['chatgpt', 'claude', 'gemini', 'deepseek'] }, '多模型会诊'),
  rule('research-document-detective', '文档堆里的侦探', 870, { captainIn: ['notebooklm'] }, '长文档取证'),
  rule('research-precision-pragmatist', '精准检索实用主义者', 860, { primaryDimension: 'research', toolCount: { max: 4 } }, '精准检索'),

  rule('creative-one-person-studio', '一人内容制作公司', 830, { minScores: { image: 80, media: 80 } }, '内容工业化'),
  rule('creative-set-designer', 'AI片场美术指导', 850, { requiredTools: ['midjourney'], anyToolGroups: [['seedance', 'runway', 'kling']] }, 'AI片场美术'),
  rule('creative-node-studio', '节点式影视工业', 840, { requiredTools: ['comfyui'], minimumMatches: [{ toolIds: ['seedance', 'sora', 'veo', 'kling', 'runway'], count: 2 }] }, '节点式影视生产'),
  rule('creative-aesthetic-tuner', '审美参数调教师', 820, { captainIn: ['midjourney'], primaryDimension: 'image' }, '视觉审美调参'),
  rule('creative-ai-director', 'AI片场导演', 810, { captainIn: ['seedance', 'sora', 'veo'] }, '生成式片场调度'),
  rule('creative-media-label', '音画一体自媒体厂牌', 800, { anyToolGroups: [['suno', 'udio'], ['seedance', 'sora', 'veo', 'kling', 'runway']] }, '音画一体生产'),
  rule('creative-visual-curator', '提示词视觉策展人', 790, { minCategoryCounts: { image: 3 } }, '视觉策展'),
  rule('creative-video-heavy-user', '生成式影像重度玩家', 780, { minCategoryCounts: { video: 4 } }, '生成式影像'),

  rule('structure-hex-solo', '六边形AI个体户', 750, { toolCount: { exact: 8 }, distinctCategories: { min: 6 } }, '六类工具协同'),
  rule('structure-heavy-specialist', '单赛道重装玩家', 925, { toolCount: { exact: 8 }, distinctCategories: { max: 2 } }, '单赛道重装'),
  rule('structure-minimalist', '极简AI实用派', 730, { toolCount: { exact: 3 }, minTopScore: 75 }, '少而精的工作流'),
  rule('structure-collector', 'AI工具收藏型人格', 720, { toolCount: { exact: 8 }, maxTopGap: 8 }, '工具收藏与均衡使用'),
  rule('structure-ai-everything', '什么都让AI做的人', 710, { allScoresAtLeast: 60 }, '全流程AI协作'),
  rule('structure-balanced-board', '工作流均衡发展委员会', 700, { maxScoreSpread: 15 }, '均衡工作流'),
  rule('structure-single-core', '单核驱动型玩家', 690, { minTopGap: 25 }, '单一强势能力'),
  rule('structure-only-captain', '全队唯一指定核心', 680, { captainIsOnlyToolInCategory: true, captainSupportsPrimaryDimension: true, minTopGap: 12 }, '唯一核心角色'),
] as const

const pair = (primary: DimensionKey, secondary: DimensionKey): string => `${primary}:${secondary}`

export const DIMENSION_PAIR_TITLES: Readonly<Record<string, string>> = {
  [pair('expression', 'research')]: '知识策划型AI玩家',
  [pair('expression', 'coding')]: '会写文案的技术负责人',
  [pair('expression', 'image')]: 'AI创意策划人',
  [pair('expression', 'media')]: '内容流水线主理人',
  [pair('expression', 'automation')]: '效率运营型玩家',
  [pair('research', 'coding')]: '技术研究型玩家',
  [pair('research', 'image')]: '视觉资料策展人',
  [pair('research', 'media')]: 'AI纪录片研究员',
  [pair('research', 'automation')]: '信息工作流架构师',
  [pair('coding', 'image')]: '创意开发型玩家',
  [pair('coding', 'media')]: '生成式互动导演',
  [pair('coding', 'automation')]: 'Agent工程型玩家',
  [pair('image', 'media')]: '视觉导演型玩家',
  [pair('image', 'automation')]: '批量创意生产主管',
  [pair('media', 'automation')]: '自动化内容厂长',
}

export const SINGLE_DIMENSION_TITLES: Readonly<Record<DimensionKey, string>> = {
  expression: '表达驱动型AI玩家',
  research: '研究驱动型AI玩家',
  coding: '工程驱动型AI玩家',
  image: '视觉驱动型AI玩家',
  media: '影音驱动型AI玩家',
  automation: '自动化驱动型AI玩家',
}

export const FALLBACK_VERDICTS = [
  '你的阵容没有照搬标准答案，而是长成了自己的工作流。',
  '工具只是名单，真正有辨识度的是你让它们如何协作。',
  '这不是能力排名，而是一张很诚实的AI使用地图。',
] as const
