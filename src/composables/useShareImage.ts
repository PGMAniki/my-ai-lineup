import { onBeforeUnmount, ref } from 'vue'
import { IS_XIAOHONGSHU } from '../config/platform'
import type { GeneratedProfile } from '../types'
import { renderShareCanvas, renderShareImage } from './shareCanvas'

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('浏览器未能读取分享图片'))
    }
    reader.onerror = () => reject(new Error('浏览器未能读取分享图片'))
    reader.readAsDataURL(blob)
  })

export const useShareImage = () => {
  const isGenerating = ref(false)
  const error = ref('')
  const previewUrl = ref('')
  const previewCanvas = ref<HTMLCanvasElement>()
  const isWeChat = /MicroMessenger/i.test(navigator.userAgent)

  const closePreview = (): void => {
    if (previewUrl.value.startsWith('blob:')) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
    previewCanvas.value = undefined
  }

  const generate = async (profile: GeneratedProfile): Promise<void> => {
    isGenerating.value = true
    error.value = ''
    closePreview()

    try {
      const homeUrl = `${window.location.origin}${window.location.pathname}#/`
      if (IS_XIAOHONGSHU) {
        // 小红书只能通过系统截图保存，直接展示 Canvas 可避开真机 WebView 中
        // 耗时明显的 PNG 编码、Blob 创建和图片二次解码。
        previewCanvas.value = await renderShareCanvas(
          profile,
          homeUrl,
          window.location.host,
          true,
        )
      } else {
        const blob = await renderShareImage(profile, homeUrl, window.location.host)
        // 微信内置浏览器无法稳定地对 blob: 图片调起“保存到手机”。
        // Data URL 会被它识别为普通 PNG，用户可直接长按保存。
        previewUrl.value = isWeChat ? await blobToDataUrl(blob) : URL.createObjectURL(blob)
      }
    } catch (reason) {
      error.value =
        reason instanceof Error
          ? reason.message
          : '分享图生成失败，请稍后重试或直接截图当前结果。'
    } finally {
      isGenerating.value = false
    }
  }

  onBeforeUnmount(closePreview)

  return { isGenerating, error, previewUrl, previewCanvas, isWeChat, generate, closePreview }
}
