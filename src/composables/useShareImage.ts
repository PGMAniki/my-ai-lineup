import { onBeforeUnmount, ref } from 'vue'
import { IS_XIAOHONGSHU } from '../config/platform'
import type { GeneratedProfile } from '../types'
import { renderShareImage } from './shareCanvas'

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
  const isWeChat = /MicroMessenger/i.test(navigator.userAgent)

  const closePreview = (): void => {
    if (previewUrl.value.startsWith('blob:')) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }

  const generate = async (profile: GeneratedProfile): Promise<void> => {
    isGenerating.value = true
    error.value = ''
    closePreview()

    try {
      const homeUrl = `${window.location.origin}${window.location.pathname}#/`
      const blob = await renderShareImage(
        profile,
        homeUrl,
        window.location.host,
        IS_XIAOHONGSHU,
      )
      // 微信内置浏览器无法稳定地对 blob: 图片调起“保存到手机”。
      // Data URL 会被它识别为普通 PNG，用户可直接长按保存。
      previewUrl.value = isWeChat ? await blobToDataUrl(blob) : URL.createObjectURL(blob)
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

  return { isGenerating, error, previewUrl, isWeChat, generate, closePreview }
}
