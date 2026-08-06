import type { DimensionScores, ToolDefinition } from '../types'

type ToolInput = Omit<ToolDefinition, 'shortName' | 'aliases' | 'tags'> & {
  shortName?: string
  aliases?: string[]
  tags?: string[]
}

const scores = (
  expression: number,
  research: number,
  coding: number,
  image: number,
  media: number,
  automation: number,
): DimensionScores => ({ expression, research, coding, image, media, automation })

const tool = (input: ToolInput): ToolDefinition => ({
  ...input,
  shortName: input.shortName ?? input.name,
  aliases: input.aliases ?? [],
  tags: input.tags ?? [],
})

export const TOOLS: readonly ToolDefinition[] = [
  tool({ id: 'chatgpt', name: 'ChatGPT', category: 'general', description: '通用对话与内容创作', aliases: ['GPT', 'OpenAI'], dimensions: scores(5, 4, 4, 4, 3, 4), tags: ['通用对话', '一站式', '多模型'] }),
  tool({ id: 'claude', name: 'Claude', category: 'general', description: '长文本思考与协作', aliases: ['克劳德', 'Anthropic'], dimensions: scores(5, 4, 4, 2, 1, 4), tags: ['通用对话', '长文档', '研究'] }),
  tool({ id: 'gemini', name: 'Gemini', category: 'general', description: '多模态通用助手', aliases: ['谷歌AI', 'Google Gemini'], dimensions: scores(5, 5, 4, 4, 4, 4), tags: ['通用对话', '多模态', '一站式'] }),
  tool({ id: 'deepseek', name: 'DeepSeek', category: 'general', description: '推理与编程助手', aliases: ['深度求索'], dimensions: scores(5, 4, 5, 1, 0, 3), tags: ['通用对话', '编程', '工程'] }),
  tool({ id: 'doubao', name: '豆包', category: 'general', description: '日常对话与多媒体创作', aliases: ['Doubao'], dimensions: scores(5, 4, 3, 4, 4, 3), tags: ['通用对话', '内容生产', '国内'] }),
  tool({ id: 'kimi', name: 'Kimi', category: 'general', description: '长文档阅读与研究', aliases: ['月之暗面', 'Moonshot'], dimensions: scores(5, 5, 3, 2, 1, 3), tags: ['通用对话', '长文档', '研究'] }),
  tool({ id: 'qwen', name: '通义千问', shortName: '千问', category: 'general', description: '通用对话与多模态任务', aliases: ['Qwen', '通义', '千问'], dimensions: scores(5, 4, 4, 3, 3, 4), tags: ['通用对话', '多模态', '国内'] }),
  tool({ id: 'grok', name: 'Grok', category: 'general', description: '实时信息与多模态助手', aliases: ['xAI', 'X Grok'], dimensions: scores(5, 5, 4, 4, 3, 4), tags: ['通用对话', '搜索', '多模态'] }),
  tool({ id: 'microsoft-copilot', name: 'Microsoft Copilot', shortName: 'Microsoft Copilot', category: 'general', description: '办公与日常任务助手', aliases: ['微软Copilot', 'MS Copilot'], dimensions: scores(5, 4, 3, 3, 2, 4), tags: ['通用对话', '办公', '一站式'] }),
  tool({ id: 'yuanbao', name: '腾讯元宝', shortName: '元宝', category: 'general', description: '腾讯生态通用AI助手', aliases: ['元宝', 'Yuanbao', '腾讯AI'], dimensions: scores(5, 4, 3, 3, 2, 3), tags: ['通用对话', '搜索', '国内'] }),
  tool({ id: 'ernie-bot', name: '文心一言', shortName: '文心一言', category: 'general', description: '百度通用AI助手', aliases: ['文心', 'ERNIE Bot', '百度AI'], dimensions: scores(5, 4, 3, 4, 3, 3), tags: ['通用对话', '内容生产', '国内'] }),

  tool({ id: 'perplexity', name: 'Perplexity', category: 'research', description: '联网搜索与答案溯源', aliases: ['PPLX'], dimensions: scores(4, 5, 1, 1, 0, 3), tags: ['搜索', '研究', '网页产品'] }),
  tool({ id: 'notebooklm', name: 'NotebookLM', shortName: 'NotebookLM', category: 'research', description: '基于资料的知识整理', aliases: ['Notebook LM', '谷歌笔记'], dimensions: scores(4, 5, 1, 1, 1, 2), tags: ['研究', '长文档', '知识管理'] }),
  tool({ id: 'genspark', name: 'Genspark', category: 'research', description: '搜索研究与任务执行', aliases: ['GenSpark'], dimensions: scores(4, 5, 2, 2, 1, 4), tags: ['搜索', '研究', '智能体'] }),
  tool({ id: 'metaso', name: '秘塔AI搜索', shortName: '秘塔搜索', category: 'research', description: '中文资料检索', aliases: ['秘塔', 'Metaso'], dimensions: scores(3, 5, 0, 0, 0, 1), tags: ['搜索', '研究', '国内'] }),

  tool({ id: 'codex', name: 'Codex', category: 'coding', description: '软件开发智能体', aliases: ['OpenAI Codex'], dimensions: scores(2, 2, 5, 0, 0, 5), tags: ['编程', '代码Agent', '工程'] }),
  tool({ id: 'claude-code', name: 'Claude Code', shortName: 'Claude Code', category: 'coding', description: '终端代码智能体', aliases: ['ClaudeCode', 'CC'], dimensions: scores(2, 2, 5, 0, 0, 5), tags: ['编程', '代码Agent', '工程'] }),
  tool({ id: 'cursor', name: 'Cursor', category: 'coding', description: 'AI 原生代码编辑器', aliases: ['Cursor IDE'], dimensions: scores(2, 2, 5, 1, 0, 4), tags: ['编程', 'IDE', '工程'] }),
  tool({ id: 'github-copilot', name: 'GitHub Copilot', shortName: 'Copilot', category: 'coding', description: 'IDE 编程协作助手', aliases: ['Copilot', 'GitHub副驾驶'], dimensions: scores(2, 1, 5, 0, 0, 4), tags: ['编程', 'IDE', '工程'] }),
  tool({ id: 'windsurf', name: 'Windsurf', category: 'coding', description: '智能体式代码编辑器', aliases: ['Codeium'], dimensions: scores(2, 2, 5, 1, 0, 4), tags: ['编程', 'IDE', '代码Agent'] }),
  tool({ id: 'replit-agent', name: 'Replit Agent', shortName: 'Replit', category: 'coding', description: '对话式应用开发智能体', aliases: ['Replit', 'Replit AI'], dimensions: scores(3, 2, 5, 2, 0, 5), tags: ['编程', '代码Agent', '智能体'] }),

  tool({ id: 'midjourney', name: 'Midjourney', shortName: 'Midjourney', category: 'image', description: '风格化图像生成', aliases: ['MJ'], dimensions: scores(1, 0, 0, 5, 2, 1), tags: ['图像', '创作', '专业工具'] }),
  tool({ id: 'chatgpt-images', name: 'ChatGPT Images', shortName: 'GPT Images', category: 'image', description: '对话式图像生成与编辑', aliases: ['GPT生图', 'ChatGPT生图', '4o生图'], dimensions: scores(3, 1, 1, 5, 2, 2), tags: ['图像', '内容生产', '一站式'] }),
  tool({ id: 'gemini-image', name: 'Gemini Image', shortName: 'Gemini Image', category: 'image', description: '对话式图像生成与编辑', aliases: ['Nano Banana', '香蕉', '谷歌生图', 'Gemini图片'], dimensions: scores(3, 2, 1, 5, 3, 2), tags: ['图像', '内容生产', '多模态'] }),
  tool({ id: 'dreamina', name: '即梦AI', shortName: '即梦', category: 'image', description: '图像与视频创作平台', aliases: ['即梦', 'Dreamina', 'Seedream'], dimensions: scores(2, 1, 0, 5, 4, 2), tags: ['图像', '视频', '国内'] }),
  tool({ id: 'comfyui', name: 'ComfyUI', category: 'image', description: '节点式生成工作流', aliases: ['Comfy UI'], dimensions: scores(0, 0, 2, 5, 4, 5), tags: ['图像', '节点工作流', '本地部署', '折腾'] }),

  tool({ id: 'seedance', name: 'Seedance', category: 'video', description: '生成式视频创作', aliases: ['豆包视频', '字节视频'], dimensions: scores(1, 0, 0, 4, 5, 2), tags: ['视频', '内容生产', '国内'] }),
  tool({ id: 'sora', name: 'Sora', category: 'video', description: '生成式视频创作', aliases: ['OpenAI Sora'], dimensions: scores(2, 1, 0, 4, 5, 2), tags: ['视频', '内容生产', '创作'] }),
  tool({ id: 'veo', name: 'Veo', category: 'video', description: '生成式视频创作', aliases: ['Google Veo', '谷歌Veo'], dimensions: scores(1, 1, 0, 4, 5, 2), tags: ['视频', '内容生产', '创作'] }),
  tool({ id: 'kling', name: '可灵AI', shortName: '可灵', category: 'video', description: '生成式视频创作', aliases: ['可灵', 'Kling', 'Kling AI'], dimensions: scores(1, 0, 0, 4, 5, 2), tags: ['视频', '内容生产', '国内'] }),
  tool({ id: 'runway', name: 'Runway', category: 'video', description: '专业生成式影像工具', aliases: ['RunwayML'], dimensions: scores(2, 1, 1, 5, 5, 4), tags: ['视频', '图像', '专业工具'] }),
  tool({ id: 'hailuo', name: '海螺AI', shortName: '海螺AI', category: 'video', description: '图生视频与创意短片', aliases: ['海螺', 'Hailuo', 'Hailuo AI', 'MiniMax视频'], dimensions: scores(1, 0, 0, 4, 5, 2), tags: ['视频', '内容生产', '国内'] }),
  tool({ id: 'pixverse', name: 'PixVerse', category: 'video', description: 'AI视频生成与特效创作', aliases: ['Pix Verse', '拍我AI'], dimensions: scores(1, 1, 0, 4, 5, 3), tags: ['视频', '内容生产', '创作'] }),

  tool({ id: 'suno', name: 'Suno', category: 'audio', description: '歌曲与音乐生成', aliases: ['Suno AI'], dimensions: scores(2, 0, 0, 2, 5, 1), tags: ['音频', '音乐', '内容生产'] }),
  tool({ id: 'udio', name: 'Udio', category: 'audio', description: '生成式音乐创作', aliases: ['Udio AI'], dimensions: scores(2, 0, 0, 2, 5, 1), tags: ['音频', '音乐', '内容生产'] }),
  tool({ id: 'elevenlabs', name: 'ElevenLabs', shortName: 'ElevenLabs', category: 'audio', description: '语音生成与配音', aliases: ['11Labs', 'Eleven Labs'], dimensions: scores(3, 0, 1, 1, 5, 3), tags: ['音频', '配音', '专业工具'] }),

  tool({ id: 'manus', name: 'Manus', category: 'agent', description: '通用任务智能体', aliases: ['Manus AI'], dimensions: scores(4, 4, 3, 2, 1, 5), tags: ['智能体', '自动化', '研究'] }),
  tool({ id: 'coze', name: 'Coze', category: 'agent', description: '智能体搭建平台', aliases: ['扣子', '扣子空间'], dimensions: scores(3, 3, 3, 2, 2, 5), tags: ['智能体', '工作流', '无代码'] }),
  tool({ id: 'dify', name: 'Dify', category: 'agent', description: 'AI 应用与工作流平台', aliases: ['Dify AI'], dimensions: scores(2, 2, 4, 1, 0, 5), tags: ['智能体', '工作流', '开源'] }),
  tool({ id: 'n8n', name: 'n8n', category: 'agent', description: '自动化工作流平台', aliases: ['N8N'], dimensions: scores(1, 1, 4, 0, 0, 5), tags: ['自动化', '工作流', '节点工作流'] }),
  tool({ id: 'zapier', name: 'Zapier', category: 'agent', description: '跨应用自动化平台', aliases: ['Zap'], dimensions: scores(2, 2, 3, 0, 0, 5), tags: ['自动化', '工作流', '无代码'] }),
] as const

export const TOOL_BY_ID: ReadonlyMap<string, ToolDefinition> = new Map(
  TOOLS.map((item) => [item.id, item]),
)
