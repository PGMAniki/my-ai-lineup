<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  imageUrl: string
  canvas?: HTMLCanvasElement
  isWeChat: boolean
  shareText: string
}>()

defineEmits<{
  close: []
}>()

const closeButton = ref<HTMLButtonElement>()
const copyStatus = ref('')

const copyShareText = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(props.shareText)
    copyStatus.value = '分享文案已复制。'
  } catch {
    copyStatus.value = '复制失败，请长按文案手动复制。'
  }
}

onMounted(async () => {
  document.body.style.overflow = 'hidden'
  await nextTick()
  closeButton.value?.focus()
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="share-modal" @click.self="$emit('close')">
    <section class="share-modal__panel" role="dialog" aria-modal="true" aria-labelledby="share-modal-title" @keydown.esc="$emit('close')">
      <header>
        <div>
          <span class="eyebrow">分享图 · 1080×1440</span>
          <h2 id="share-modal-title">你的阵容分享图</h2>
        </div>
        <button ref="closeButton" type="button" aria-label="关闭分享图" @click="$emit('close')">×</button>
      </header>
      <img :src="imageUrl" alt="我的AI阵容分享图预览" draggable="false" />
      <p>{{ isWeChat ? '请长按上方图片，选择“保存到手机”或发送给朋友。' : '点击下方按钮保存图片。' }}</p>
      <a v-if="!isWeChat" :href="imageUrl" download="我的AI阵容.png">保存图片</a>
      <section class="share-modal__copy" aria-labelledby="share-copy-title">
        <strong id="share-copy-title">推荐分享文案</strong>
        <p>{{ shareText }}</p>
        <button type="button" @click="copyShareText">复制分享文案</button>
        <span v-if="copyStatus" role="status">{{ copyStatus }}</span>
      </section>
    </section>
  </div>
</template>

<style scoped>
.share-modal {
  position: fixed;
  z-index: 50;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgb(0 0 0 / 82%);
}

.share-modal__panel {
  width: min(100%, 440px);
  max-height: calc(100vh - 36px);
  overflow-y: auto;
  padding: 16px;
  border: 1px solid var(--color-border-strong);
  border-radius: 20px;
  background: var(--color-surface-1);
}

.share-modal header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.share-modal h2 {
  margin: 5px 0 0;
  font-size: 20px;
}

.share-modal header button {
  width: 44px;
  height: 44px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  color: var(--color-text-secondary);
  background: transparent;
  font-size: 24px;
  cursor: pointer;
}

.share-modal img {
  display: block;
  width: 100%;
  margin: 0 auto;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  -webkit-touch-callout: default;
  user-select: auto;
}

@media (max-width: 480px) {
  .share-modal {
    padding: 10px;
  }

  .share-modal__panel {
    max-height: calc(100vh - 20px);
    padding: 12px;
  }
}

.share-modal p {
  margin: 14px 0;
  text-align: center;
  font-size: 12px;
}

.share-modal a {
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: var(--color-background);
  background: var(--color-accent);
  font-weight: 800;
  text-decoration: none;
}

.share-modal__copy {
  margin-top: 14px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: rgb(11 13 18 / 55%);
}

.share-modal__copy strong {
  font-size: 13px;
}

.share-modal__copy p {
  margin: 8px 0 10px;
  color: var(--color-text-secondary);
  text-align: left;
  line-height: 1.55;
  white-space: pre-wrap;
}

.share-modal__copy button {
  width: 100%;
  min-height: 42px;
  border: 1px solid var(--color-border-strong);
  border-radius: 10px;
  color: var(--color-text);
  background: transparent;
  font-weight: 700;
  cursor: pointer;
}

.share-modal__copy span {
  display: block;
  margin-top: 8px;
  color: var(--color-accent);
  font-size: 12px;
  text-align: center;
}
</style>
