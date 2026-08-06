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

const drawFittedText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  initialSize: number,
  minimumSize: number,
  weight = 800,
): void => {
  let fontSize = initialSize
  context.font = `${weight} ${fontSize}px system-ui, sans-serif`
  while (fontSize > minimumSize && context.measureText(text).width > maxWidth) {
    fontSize -= 1
    context.font = `${weight} ${fontSize}px system-ui, sans-serif`
  }
  context.fillText(text, x, y)
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
  context.font = '800 30px system-ui, sans-serif'
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
  roundedRect(context, 72, captainTop, 8, 82, 4)
  context.fillStyle = ACCENT
  context.fill()
  context.fillStyle = MUTED
  context.font = '700 19px system-ui, sans-serif'
  context.fillText('本命 AI', 104, captainTop + 50)
  context.fillStyle = ACCENT
  drawFittedText(context, profile.captain.name, 230, captainTop + 54, 738, 38, 27)

  const radarCenterY = Math.max(615, captainBottom + 210)
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

  context.fillStyle = TEXT
  context.font = '800 27px system-ui, sans-serif'
  const rosterTitleY = tagsTitleY + 110
  context.fillText('我的常用AI', 72, rosterTitleY)
  const rosterHeadingWidth = context.measureText('我的常用AI').width
  context.fillStyle = MUTED
  context.font = '600 17px system-ui, sans-serif'
  context.fillText(`${profile.selectedTools.length}款`, 72 + rosterHeadingWidth + 18, rosterTitleY)
  if (isXiaohongshu) {
    context.textAlign = 'right'
    context.fillStyle = MUTED
    context.font = '600 17px system-ui, sans-serif'
    context.fillText('小红书搜索「刘道理」', 1008, rosterTitleY)
    context.textAlign = 'left'
  }
  profile.selectedTools.forEach((tool, index) => {
    const column = index % 2
    const row = Math.floor(index / 2)
    const x = 72 + column * 480
    const xhsCardSize =
      profile.selectedTools.length <= 4
        ? { height: 128, step: 138, font: 45, baseline: 82 }
        : profile.selectedTools.length <= 6
          ? { height: 82, step: 90, font: 38, baseline: 55 }
          : { height: 68, step: 76, font: 34, baseline: 46 }
    const cardHeight = isXiaohongshu ? xhsCardSize.height : 54
    const rowStep = isXiaohongshu ? xhsCardSize.step : 61
    const y = rosterTitleY + 24 + row * rowStep
    roundedRect(context, x, y, 456, cardHeight, 14)
    context.fillStyle = tool.id === profile.captain.id ? 'rgba(132,255,106,0.10)' : SURFACE
    context.fill()
    context.strokeStyle = tool.id === profile.captain.id ? 'rgba(132,255,106,0.48)' : 'rgba(255,255,255,0.10)'
    context.lineWidth = 2
    context.stroke()
    context.fillStyle = tool.id === profile.captain.id ? ACCENT : TEXT
    drawFittedText(
      context,
      tool.shortName,
      x + 22,
      y + (isXiaohongshu ? xhsCardSize.baseline : 37),
      412,
      isXiaohongshu ? xhsCardSize.font : 30,
      22,
    )
  })

  if (!isXiaohongshu) {
    roundedRect(context, 72, 1242, 936, 128, 24)
    context.fillStyle = SURFACE
    context.fill()

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
