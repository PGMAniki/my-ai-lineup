import QRCode from 'qrcode'
import { DIMENSIONS } from '../config/dimensions'
import { createRadarPolygon } from '../core/radarGeometry'
import { wrapText } from '../core/textLayout'
import type { GeneratedProfile } from '../types'

const WIDTH = 1080
const HEIGHT = 1440
const ACCENT = '#84ff6a'
const TEXT = '#f6f7f9'
const MUTED = '#9aa3b4'
const SURFACE = '#141821'

const roundedRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void => {
  context.beginPath()
  context.roundRect(x, y, width, height, radius)
}

const drawWrappedText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
): number => {
  const lines = wrapText(text, maxWidth, (value) => context.measureText(value).width, maxLines)
  lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight))
  return y + lines.length * lineHeight
}

const drawRadar = (
  context: CanvasRenderingContext2D,
  profile: GeneratedProfile,
  centerX: number,
  centerY: number,
  radius: number,
): void => {
  const gridValues = [25, 50, 75, 100]
  context.lineWidth = 2

  gridValues.forEach((value) => {
    const points = createRadarPolygon(Array(6).fill(value), 100, radius, 0)
    context.beginPath()
    points.forEach((point, index) => {
      const x = centerX + point.x
      const y = centerY + point.y
      if (index === 0) context.moveTo(x, y)
      else context.lineTo(x, y)
    })
    context.closePath()
    context.strokeStyle = value === 100 ? 'rgba(122,156,255,0.35)' : 'rgba(255,255,255,0.10)'
    context.stroke()
  })

  const axisPoints = createRadarPolygon(Array(6).fill(100), 100, radius, 0)
  axisPoints.forEach((point) => {
    context.beginPath()
    context.moveTo(centerX, centerY)
    context.lineTo(centerX + point.x, centerY + point.y)
    context.strokeStyle = 'rgba(255,255,255,0.10)'
    context.lineWidth = 2
    context.stroke()
  })

  const resultPoints = createRadarPolygon(
    DIMENSIONS.map((dimension) => profile.dimensionScores[dimension.key]),
    100,
    radius,
    0,
  )
  context.beginPath()
  resultPoints.forEach((point, index) => {
    const x = centerX + point.x
    const y = centerY + point.y
    if (index === 0) context.moveTo(x, y)
    else context.lineTo(x, y)
  })
  context.closePath()
  context.fillStyle = 'rgba(132,255,106,0.18)'
  context.fill()
  context.strokeStyle = ACCENT
  context.lineWidth = 5
  context.stroke()

  context.font = '700 27px system-ui, sans-serif'
  context.textAlign = 'center'
  DIMENSIONS.forEach((dimension, index) => {
    const angle = -Math.PI / 2 + index * (Math.PI * 2 / 6)
    const labelRadius = radius + 66
    const x = centerX + Math.cos(angle) * labelRadius
    const y = centerY + Math.sin(angle) * labelRadius
    context.fillStyle = MUTED
    context.fillText(dimension.shortName, x, y)
    context.fillStyle = TEXT
    context.font = '800 30px system-ui, sans-serif'
    context.fillText(String(profile.dimensionScores[dimension.key]), x, y + 34)
    context.font = '700 27px system-ui, sans-serif'
  })
  context.textAlign = 'left'
}

const loadImage = (source: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('二维码图片加载失败'))
    image.src = source
  })

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('浏览器未能导出分享图片'))
    }, 'image/png')
  })

export const renderShareImage = async (
  profile: GeneratedProfile,
  homeUrl: string,
  displayHost: string,
  isXiaohongshu = false,
): Promise<Blob> => {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const context = canvas.getContext('2d')
  if (!context) throw new Error('当前浏览器不支持Canvas分享图')

  context.fillStyle = '#0b0d12'
  context.fillRect(0, 0, WIDTH, HEIGHT)
  context.strokeStyle = 'rgba(122,156,255,0.06)'
  context.lineWidth = 1
  for (let position = 0; position <= WIDTH; position += 64) {
    context.beginPath()
    context.moveTo(position, 0)
    context.lineTo(position, HEIGHT)
    context.stroke()
  }
  for (let position = 0; position <= HEIGHT; position += 64) {
    context.beginPath()
    context.moveTo(0, position)
    context.lineTo(WIDTH, position)
    context.stroke()
  }

  context.fillStyle = ACCENT
  context.font = '800 27px system-ui, sans-serif'
  context.letterSpacing = '5px'
  context.fillText('我的AI身份', 72, 68)
  context.letterSpacing = '0px'

  context.fillStyle = TEXT
  context.font = '900 64px system-ui, sans-serif'
  const titleBottom = drawWrappedText(context, profile.title, 72, 150, 900, 70, 2)

  context.fillStyle = TEXT
  context.font = '500 28px system-ui, sans-serif'
  const verdictBottom = drawWrappedText(context, profile.verdict, 72, titleBottom + 14, 920, 40, 2)

  const captainTop = verdictBottom + 12
  const captainBottom = captainTop + 82
  roundedRect(context, 72, captainTop, 936, 82, 22)
  context.fillStyle = SURFACE
  context.fill()
  context.fillStyle = MUTED
  context.font = '700 19px system-ui, sans-serif'
  context.fillText('本命 AI', 96, captainTop + 32)
  context.fillStyle = ACCENT
  context.font = '800 32px system-ui, sans-serif'
  context.textAlign = 'right'
  context.fillText(profile.captain.name, 984, captainTop + 52)
  context.textAlign = 'left'

  const radarCenterY = Math.max(650, captainBottom + 228)
  drawRadar(context, profile, 540, radarCenterY, 170)

  const tagsTitleY = radarCenterY + 250

  context.fillStyle = MUTED
  context.font = '700 18px system-ui, sans-serif'
  context.fillText('身份标签', 72, tagsTitleY)
  profile.labels.forEach((label, index) => {
    const x = 72 + index * 230
    roundedRect(context, x, tagsTitleY + 18, 210, 56, 28)
    context.fillStyle = 'rgba(132,255,106,0.08)'
    context.fill()
    context.strokeStyle = 'rgba(132,255,106,0.30)'
    context.stroke()
    context.fillStyle = ACCENT
    context.font = '700 23px system-ui, sans-serif'
    context.textAlign = 'center'
    context.fillText(`# ${label}`, x + 105, tagsTitleY + 54)
  })
  context.textAlign = 'left'

  context.fillStyle = MUTED
  context.font = '700 18px system-ui, sans-serif'
  const rosterTitleY = tagsTitleY + 110
  context.fillText(`我的AI阵容 · ${profile.selectedTools.length}款工具`, 72, rosterTitleY)
  profile.selectedTools.forEach((tool, index) => {
    const column = index % 4
    const row = Math.floor(index / 4)
    const x = 72 + column * 235
    const y = rosterTitleY + 24 + row * 64
    context.strokeStyle = 'rgba(255,255,255,0.12)'
    context.lineWidth = 2
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x + 200, y)
    context.stroke()
    context.fillStyle = tool.id === profile.captain.id ? ACCENT : TEXT
    context.font = '800 27px system-ui, sans-serif'
    const name = tool.shortName.length > 11 ? `${tool.shortName.slice(0, 10)}…` : tool.shortName
    context.fillText(name, x, y + 41)
  })

  roundedRect(context, 72, 1242, 936, 128, 24)
  context.fillStyle = SURFACE
  context.fill()

  if (isXiaohongshu) {
    context.fillStyle = ACCENT
    context.font = '900 34px system-ui, sans-serif'
    context.textAlign = 'center'
    context.fillText('小红书搜索 刘道理', 540, 1294)
    context.fillStyle = MUTED
    context.font = '600 21px system-ui, sans-serif'
    context.fillText('截图保存 · 分享你的AI身份', 540, 1335)
    context.textAlign = 'left'
  } else {
    const qrDataUrl = await QRCode.toDataURL(homeUrl, {
      width: 180,
      margin: 1,
      color: { dark: '#0b0d12', light: '#f6f7f9' },
      errorCorrectionLevel: 'M',
    })
    const qrImage = await loadImage(qrDataUrl)
    context.drawImage(qrImage, 90, 1254, 104, 104)

    context.fillStyle = TEXT
    context.font = '800 29px system-ui, sans-serif'
    context.fillText('测测你是哪种AI玩家', 222, 1282)
    context.fillStyle = MUTED
    context.font = '500 21px system-ui, sans-serif'
    context.fillText('无需登录 · 本地生成 · 结果仅供娱乐', 222, 1320)
    context.fillStyle = ACCENT
    context.font = '700 20px system-ui, sans-serif'
    context.textAlign = 'right'
    context.fillText(displayHost, 984, 1350)
    context.textAlign = 'left'
  }

  context.fillStyle = '#687183'
  context.font = '500 17px system-ui, sans-serif'
  context.fillText('六维结果反映工具用途倾向，不代表工具能力排名。', 72, 1415)
  if (!isXiaohongshu) {
    context.textAlign = 'right'
    context.fillStyle = MUTED
    context.font = '600 18px system-ui, sans-serif'
    context.fillText('Created by 刘道理', 1008, 1415)
    context.textAlign = 'left'
  }

  return canvasToBlob(canvas)
}
