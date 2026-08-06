# 验收测试

## 自动化门禁

每次功能改动必须全部通过：

```text
npm run typecheck
npm run test
npm run build
```

## 算法验收

- 本命 1.25 倍加权正确。
- 每个维度只取最高 3 款。
- 所有分数为 0–100 的整数。
- 工具顺序不影响分数、称号和判词。
- 同一阵容和本命始终产生同一结果。
- 非法数量、重复或未知工具、缺失/非法本命均产生明确错误。
- 高优先级规则优先，无特殊命中时进入稳定兜底。

固定阵容样例：

- 开发：Codex、Cursor、Claude、n8n；本命 Codex。
- 内容：ChatGPT、Midjourney、Seedance、Runway、Suno；本命 Seedance。
- 研究：Claude、Perplexity、NotebookLM、Kimi；本命 NotebookLM。
- 全能：ChatGPT、Perplexity、Codex、Midjourney、Seedance、Coze；本命 ChatGPT。
- 极简：DeepSeek、Cursor、Codex；本命 Cursor。

## 页面验收

首页：玩法和主按钮首屏可见，无横向滚动。

选择页：别名搜索、分类、数量、3–8 限制和刷新恢复正确；固定底栏不遮挡内容。

结果页：URL 可还原；分数、称号和判词稳定；返回修改不丢选择；异常配置不得白屏。

分享图：中文正常、文本不越界、名称不重叠、二维码可识别，iOS/Android/微信内可查看和保存。

## 兼容与质量

- 验证 320、375、390、430px 宽度和 520px PC 容器。
- 验证微信内置浏览器、iOS Safari、Android Chrome/WebView。
- 点击反馈目标小于 100ms，结果计算应在单帧内完成。
- 初始 JavaScript gzip 前压缩体积尽量控制在 200KB 内。
- 无个人信息请求、网络业务接口或阻断性控制台错误。

## MVP 完成标准

新用户无需额外说明即可完成选择并稳定生成结果；结果与工具有明确联系；分享图可独立理解；链接可还原；无业务后端；Cloudflare Pages 能自动构建部署；核心算法可迁移到小程序。

