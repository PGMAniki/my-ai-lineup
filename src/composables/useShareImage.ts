import { onBeforeUnmount, ref } from 'vue'
import { IS_XIAOHONGSHU } from '../config/platform'
import type { GeneratedProfile } from '../types'
import { renderShareImage } from './shareCanvas'

export const useShareImage = () => {
  const isGenerating = ref(false)
  const error = ref('')
  const previewUrl = ref('')
  const isWeChat = /MicroMessenger/i.test(navigator.userAgent)

  const closePreview = (): void => {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
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
      previewUrl.value = URL.createObjectURL(blob)
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
