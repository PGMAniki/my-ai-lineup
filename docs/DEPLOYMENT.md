# Cloudflare Pages 部署

## 架构

首发版本为纯静态站点：Git 仓库触发 Cloudflare Pages 构建，发布 `dist`。不启用 Workers、Pages Functions、KV、D1、R2、服务器或 API。

## 构建设置

- Framework preset：Vue。
- Build command：`npm run build:h5`。
- Build output directory：`dist/h5`。
- Node.js：使用部署环境支持的当前稳定 LTS，并与项目构建验证保持一致。

发布前必须运行 typecheck、test 和 build。

## 双目标构建

- `npm run build:h5`：生成 Cloudflare Pages 使用的 H5 产物到 `dist/h5`。
- `npm run build:xhs`：生成小红书离线容器产物到 `dist/xhs`。
- `npm run package:xhs`：构建、执行禁用能力扫描，并输出 `artifacts/my-ai-lineup-xhs.zip`。

两端复用同一套工具数据、评分、称号和页面。小红书构建使用相对资源路径，并在构建入口替换剪贴板、下载、外链和分享弹窗能力。

## 路由

使用 `createWebHashHistory()`。结果链接形如：

```text
https://example.com/#/result?v=1&t=chatgpt,codex,midjourney&c=codex
```

静态托管无需 SPA 回退规则。

## 缓存

建议 `public/_headers`：

```text
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/
  Cache-Control: public, max-age=0, must-revalidate
```

## 域名上线清单

1. 将正式域名接入 Cloudflare DNS。
2. 在 Pages 项目添加自定义域名并等待 HTTPS 生效。
3. 验证移动网络、微信内访问及分享链接。
4. 验证二维码目标和短域名。
5. 将 `pages.dev` 地址重定向到正式域名。

## 回滚与验证

- 保留最近一次稳定部署。
- 发布后检查首页、选择、结果还原和静态资源缓存。
- 若分享或解析异常，优先回滚，不在生产环境静默更改规则版本。
- 首发不接分析 SDK；托管平台基础 Web Analytics 只能作为后续独立决策。
