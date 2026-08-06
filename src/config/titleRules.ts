import type { DimensionKey, TitleCondition, TitleRule, ToolCategory } from '../types'

const rule = (
  id: string,
  title: string,
  priority: number,
  condition: TitleCondition,
  verdicts: [string, string, string],
): TitleRule => ({ id, title, priority, condition, verdicts })

export const TITLE_RULES: readonly TitleRule[] = [
  rule('dev-ai-contractor', 'AI全栈包工头', 1000, { minimumMatches: [{ toolIds: ['codex', 'claude-code', 'cursor'], count: 2 }], minScores: { automation: 70 }, minCategoryCounts: { coding: 3 }, dominantSpecialistCategory: 'coding' }, ['需求刚说完，你的代码搭子已经开始分工了。', '写代码只是开工，调度一队智能体才是你的日常。', '从拆任务到验收，你习惯让多个代码助手接力完成。']),
  rule('dev-cyber-director', '赛博工程总监', 990, { minScores: { coding: 80, automation: 80 }, minCategoryCounts: { coding: 2, agent: 1 }, dominantSpecialistCategory: 'coding' }, ['你管的不只代码，还有整条自动化生产线。', '代码助手负责施工，工作流工具负责把现场运转起来。', '你的开发习惯带着明显的工程管理味。']),
  rule('dev-ide-resident', 'IDE常住人口', 980, { captainIn: ['cursor', 'github-copilot', 'windsurf'], dominantSpecialistCategory: 'coding' }, ['聊天窗口偶尔去，编辑器才是你的主场。', '你的AI使用时长，大概可以直接按 IDE 在线时间统计。', '补全、重构、对话、提交，一天都在编辑器里闭环。']),
  rule('dev-workflow-wirer', '工作流接线员', 970, { minimumMatches: [{ toolIds: ['dify', 'coze', 'n8n'], count: 2 }], dominantSpecialistCategory: 'agent' }, ['一个节点接一个节点，最后总能跑成一条线。', '你看到重复操作时，第一反应是给它接个工作流。', '按钮可以少点几次，流程必须多跑几遍。']),
  rule('dev-node-alchemist', '节点炼金术士', 960, { requiredTools: ['comfyui'], anyToolGroups: [['n8n', 'dify', 'coze']] }, ['节点在别人眼里是线团，在你手里是配方。', '你喜欢把生成过程拆开，逐段调到顺手为止。', '连线、试跑、改参数，你的创作台有点像实验室。']),
  rule('dev-startup-cto', '一句话创业公司CTO', 950, { requiredTools: ['replit-agent'], anyToolGroups: [['codex', 'claude-code']], dominantSpecialistCategory: 'coding' }, ['一个想法刚冒头，你已经准备让它上线了。', '原型、代码、部署都有人干，而这个“人”通常是AI。', '你的项目启动仪式很短：先说需求，然后看它开工。']),
  rule('dev-agent-breeder', '代码智能体饲养员', 940, { minCategoryCounts: { coding: 3 }, dominantSpecialistCategory: 'coding' }, ['每个代码助手都有脾气，你已经摸清了大半。', '同一道需求交给谁，你心里有一张隐形排班表。', '你收集代码智能体，像是在组一支技术小队。']),

  rule('research-web-archaeologist', '互联网资料考古学家', 900, { requiredTools: ['perplexity', 'notebooklm'], dominantSpecialistCategory: 'research' }, ['你愿意顺着引用继续挖，直到找到最初那块证据。', '网页负责提供线索，资料库负责留下案卷。', '搜索结果只是入口，你更在意它从哪里来。']),
  rule('research-universe-admin', '资料宇宙管理员', 910, { requiredTools: ['perplexity', 'notebooklm', 'genspark'], dominantSpecialistCategory: 'research' }, ['搜索、归档、整理，你给资料安排了完整生命周期。', '信息到了你这里，很少还能保持散乱。', '你的知识库有自己的秩序，也有自己的入口。']),
  rule('research-cyber-clerk', '知识型赛博文官', 890, { minScores: { expression: 80, research: 80 }, minCategoryCounts: { research: 2 }, dominantSpecialistCategory: 'research' }, ['资料要有出处，结论要能归档，措辞还得清楚。', '你擅长把一堆信息整理成可以交付的东西。', '搜索和写作在你这里属于同一道工序。']),
  rule('research-model-panelist', '模型横评区常驻嘉宾', 880, { minCategoryCounts: { general: 4 }, maxSpecialistTools: 1 }, ['同一个问题多问几遍，你是在组建自己的评审团。', '模型各有说法，你负责追问、比较和投最后一票。', '一个答案很难让你满意，多方会诊才算完整。']),
  rule('research-multi-model-doctor', '多模型会诊专家', 920, { requiredTools: ['chatgpt', 'claude', 'gemini', 'deepseek'], maxSpecialistTools: 1 }, ['四位主治模型到齐，复杂问题可以开会了。', '你熟悉每个模型的长处，也知道该把问题转给谁。', '你的答案往往经过几轮会诊才正式出院。']),
  rule('research-document-detective', '文档堆里的侦探', 870, { captainIn: ['notebooklm'], dominantSpecialistCategory: 'research' }, ['长文档在你眼里是一处等待取证的现场。', '你会追着原文、页码和上下文把结论拼完整。', '资料越厚，你越想知道关键一句藏在哪里。']),
  rule('research-precision-pragmatist', '精准检索实用主义者', 860, { primaryDimension: 'research', toolCount: { max: 4 } }, ['工具不必铺满，能快速找到可信答案就够了。', '你的搜索阵容很克制，每一款都有明确用途。', '少开几个窗口，把出处和结论查清楚。']),

  rule('creative-one-person-studio', '一人内容制作公司', 830, { minScores: { image: 80, media: 80 }, dominantSpecialistGroup: ['image', 'video', 'audio'] }, ['选题还在桌上，画面和成片已经开始排队。', '你的工具栏足够撑起一间小型内容工作室。', '从视觉到影音，你习惯一个人把制作链走完。']),
  rule('creative-set-designer', 'AI片场美术指导', 850, { requiredTools: ['midjourney'], anyToolGroups: [['seedance', 'runway', 'kling']] }, ['先定风格，再让镜头动起来，这是你的片场规矩。', '画面的光、色和质感，开拍前就已经被你管住了。', '你对生成视频的第一要求，通常是美术得先过关。']),
  rule('creative-node-studio', '节点式影视工业', 840, { requiredTools: ['comfyui'], minimumMatches: [{ toolIds: ['seedance', 'sora', 'veo', 'kling', 'runway'], count: 2 }] }, ['每一帧背后，都能展开一张不小的节点图。', '你把影视生成拆成工序，再一段段接回成片。', '镜头可以很梦幻，生产流程必须足够清醒。']),
  rule('creative-aesthetic-tuner', '审美参数调教师', 820, { captainIn: ['midjourney'], primaryDimension: 'image' }, ['你说的“再来一版”，通常只差一点微妙的味道。', '提示词只是起点，取舍和审美才是你的主工具。', '同一张图调十次，你能说清每次哪里更对。']),
  rule('creative-ai-director', 'AI片场导演', 810, { captainIn: ['seedance', 'sora', 'veo'] }, ['镜头不会自己讲故事，所以你一直在场。', '你习惯从运动、节奏和叙事去安排生成画面。', '生成按钮按下去以后，导演的工作才刚开始。']),
  rule('creative-media-label', '音画一体自媒体厂牌', 800, { anyToolGroups: [['suno', 'udio'], ['seedance', 'sora', 'veo', 'kling', 'runway']], dominantSpecialistGroup: ['audio', 'video'] }, ['画面和声音都握在手里，你已经具备厂牌雏形。', '配乐不用等，镜头也不用等，整条内容线可以自己跑。', '你做内容时，耳朵和眼睛总是一起开工。']),
  rule('creative-visual-curator', '提示词视觉策展人', 790, { minCategoryCounts: { image: 3 }, dominantSpecialistCategory: 'image' }, ['你收藏的不只是图片，还有生成它们的审美路径。', '不同生图工具各有展位，你负责决定谁能入场。', '风格很多，最后留下来的那一张很有你的标准。']),
  rule('creative-video-heavy-user', '生成式影像重度玩家', 780, { minCategoryCounts: { video: 4 }, dominantSpecialistCategory: 'video' }, ['视频模型更新得再快，你大概都能认出它们的手感。', '文生视频、图生视频、特效镜头，你的入口从来不止一个。', '你的生成队列里，最不缺的就是下一条视频。']),
  rule('creative-music-producer', '赛博卧室制作人', 775, { minCategoryCounts: { audio: 2 }, dominantSpecialistCategory: 'audio' }, ['旋律、主唱、配器都能换，你总想再听一个版本。', '一张桌子加几款AI，已经够你开一间小录音室。', '你的生成记录听起来像一张还在制作中的专辑。']),

  rule('structure-hex-solo', '六边形AI个体户', 750, { toolCount: { exact: 8 }, distinctCategories: { min: 6 } }, ['从查资料到出成片，你的工具栏几乎没有空位。', '一个人覆盖六种工种，这套阵容确实很像小公司。', '任务类型随便换，你总能从队伍里找到接手的人。']),
  rule('structure-heavy-specialist', '单赛道重装玩家', 925, { toolCount: { exact: 8 }, maxSpecialistCategories: 1 }, ['一个方向配八件装备，你对主赛道相当认真。', '工具看起来很多，火力却稳稳集中在同一处。', '同类工具各留一手，是你给专业工作准备的冗余。']),
  rule('structure-minimalist', '极简AI实用派', 730, { toolCount: { exact: 3 }, minTopScore: 75 }, ['三款够用的工具，比一整页收藏夹更让你安心。', '你的阵容不大，每个位置都承担着明确任务。', '少开窗口，照样把最重要的事做完。']),
  rule('structure-collector', 'AI工具收藏型人格', 720, { toolCount: { exact: 8 }, maxTopGap: 8, maxScoreSpread: 20, distinctCategories: { min: 4 } }, ['你的工具栏像展柜，每一格都舍不得空着。', '新工具先收下，适合放在哪个位置可以慢慢研究。', '你对AI产品的兴趣，已经覆盖了大半条工作流。']),
  rule('structure-ai-everything', '什么都让AI做的人', 710, { allScoresAtLeast: 60, minSpecialistCategories: 4 }, ['能交给AI的环节，你很少坚持手工硬扛。', '写、查、画、做视频、跑流程，你已经习惯全线协作。', '你的AI阵容覆盖得很完整，临时来活也不容易缺人。']),
  rule('structure-balanced-board', '工作流均衡发展委员会', 700, { maxScoreSpread: 15 }, ['六项能力排得很整齐，谁也没被落下太远。', '你的阵容像一张圆桌，每类能力都有发言权。', '没有明显短板，是这套组合最稳定的地方。']),
  rule('structure-single-core', '单核驱动型玩家', 690, { minTopGap: 25 }, ['你的阵容有一条很清楚的主线，其余工具都在配合它。', '最强能力拉开了距离，你知道自己主要靠AI做什么。', '工具可以有很多，真正高频的工作只有一个中心。']),
  rule('structure-only-captain', '全队唯一指定核心', 680, { captainIsOnlyToolInCategory: true, captainSupportsPrimaryDimension: true, minTopGap: 12 }, ['本命站在最关键的位置，整套阵容都在给它递球。', '队伍各有分工，但主心骨是谁一眼就能看出来。', '你选的本命确实扛住了这套工作流的核心能力。']),
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

const categoryPair = (left: ToolCategory, right: ToolCategory): string =>
  [left, right].sort().join(':')

export const SPECIALIST_CATEGORY_PAIR_TITLES: Readonly<Record<string, string>> = {
  [categoryPair('coding', 'research')]: '技术研究型玩家',
  [categoryPair('coding', 'image')]: '创意开发型玩家',
  [categoryPair('coding', 'video')]: '生成式互动导演',
  [categoryPair('coding', 'audio')]: '声音技术流玩家',
  [categoryPair('coding', 'agent')]: 'Agent工程型玩家',
  [categoryPair('research', 'image')]: '视觉资料策展人',
  [categoryPair('research', 'video')]: 'AI纪录片研究员',
  [categoryPair('research', 'audio')]: '声音资料研究员',
  [categoryPair('research', 'agent')]: '信息工作流架构师',
  [categoryPair('image', 'video')]: '视觉导演型玩家',
  [categoryPair('image', 'audio')]: '跨媒体创意人',
  [categoryPair('image', 'agent')]: '批量创意生产主管',
  [categoryPair('video', 'audio')]: '内容流水线主理人',
  [categoryPair('video', 'agent')]: '自动化内容厂长',
  [categoryPair('audio', 'agent')]: '声音工作流主理人',
}

export const FALLBACK_VERDICTS = [
  '这份名单很像你的日常：常用的留下，需要时能接上。',
  '几种能力搭在一起，刚好拼出了你的AI使用习惯。',
  '从工具组合里，已经能看出你最常处理哪类任务。',
] as const
