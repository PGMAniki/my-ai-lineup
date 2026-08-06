import { readdir, readFile, stat } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'

const root = new URL('../dist/xhs/', import.meta.url)
const allowedExtensions = new Set([
  '.html',
  '.css',
  '.js',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg',
  '.woff',
  '.woff2',
  '.json',
])
const textExtensions = new Set(['.html', '.css', '.js', '.json'])
const forbiddenPatterns = [
  ['网络请求 fetch', /\bfetch\s*\(/],
  ['网络请求 XMLHttpRequest', /\bXMLHttpRequest\b/],
  ['剪贴板', /navigator\.clipboard|execCommand\s*\(\s*['"](?:copy|cut|paste)/],
  ['实时通信', /\bWebSocket\b|\bEventSource\b|\bRTCPeerConnection\b/],
  ['Worker', /\b(?:SharedWorker|Worker)\s*\(|serviceWorker/],
  ['动态执行', /\beval\s*\(|\bnew\s+Function\s*\(/],
  ['WebAssembly', /\bWebAssembly\b/],
  ['外部地址', /https?:\/\//],
  ['文件下载', /\bdownload\b/],
  ['打开外链', /window\.open\s*\(|target\s*[:=]\s*['"]_blank/],
  ['内嵌页面', /<\s*(?:iframe|object)\b/i],
]

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(path)))
    else files.push(path)
  }
  return files
}

const rootPath = root.pathname
const indexPath = join(rootPath, 'index.html')
if (!(await stat(indexPath)).isFile()) throw new Error('dist/xhs/index.html 不存在')

const files = await walk(rootPath)
const violations = []
for (const file of files) {
  const extension = extname(file).toLowerCase()
  const name = relative(rootPath, file)
  if (!allowedExtensions.has(extension)) violations.push(`${name}: 不支持的文件类型 ${extension}`)
  if (!textExtensions.has(extension)) continue
  const content = await readFile(file, 'utf8')
  const scannedContent = content
    .replaceAll('http://www.w3.org/2000/svg', '')
    .replaceAll('http://www.w3.org/1998/Math/MathML', '')
    .replaceAll('http://www.w3.org/1999/xlink', '')
    .replaceAll('https://vuejs.org/error-reference/', '')
  for (const [label, pattern] of forbiddenPatterns) {
    if (pattern.test(scannedContent)) violations.push(`${name}: 命中${label}`)
  }
}

const indexHtml = await readFile(indexPath, 'utf8')
if (!indexHtml.includes('viewport-fit=cover')) violations.push('index.html: viewport 缺少 viewport-fit=cover')
if (/\s(?:src|href)=["']\//.test(indexHtml)) violations.push('index.html: 存在绝对资源路径')
if (/<script(?![^>]*\ssrc=)[^>]*>/i.test(indexHtml)) violations.push('index.html: 存在内联脚本')

if (violations.length > 0) {
  throw new Error(`小红书产物校验失败：\n- ${violations.join('\n- ')}`)
}

const totalBytes = (
  await Promise.all(files.map(async (file) => (await stat(file)).size))
).reduce((sum, size) => sum + size, 0)

console.log(`小红书产物校验通过：${files.length} 个文件，${(totalBytes / 1024).toFixed(1)} KiB`)
