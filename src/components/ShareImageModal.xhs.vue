<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

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
const displayCanvas = ref<HTMLCanvasElement>()
const screenshotMode = ref(false)

const paintCanvas = async (): Promise<void> => {
  await nextTick()
  const target = displayCanvas.value
  const source = props.canvas
  if (!target || !source) return
  const context = target.getContext('2d')
  if (!context) return
  context.clearRect(0, 0, target.width, target.height)
  context.drawImage(source, 0, 0)
}

const enterScreenshotMode = (): void => {
  screenshotMode.value = true
}

const leaveScreenshotMode = (): void => {
  screenshotMode.value = false
}

onMounted(async () => {
  document.body.style.overflow = 'hidden'
  await nextTick()
  closeButton.value?.focus()
  await paintCanvas()
})

watch([() => props.canvas, screenshotMode], paintCanvas)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <div
    v-if="screenshotMode"
    class="screenshot-view"
    role="button"
    tabindex="0"
    aria-label="退出截图模式"
    @click="leaveScreenshotMode"
    @keydown.enter="leaveScreenshotMode"
  >
    <canvas
      ref="displayCanvas"
      :width="canvas?.width ?? 1080"
      :height="canvas?.height ?? 1440"
      aria-label="我的AI阵容分享图，点击退出截图模式"
    ></canvas>
  </div>

  <div v-else class="share-modal" @click.self="$emit('close')">
    <section
      class="share-modal__panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      @keydown.esc="$emit('close')"
    >
      <header>
        <div>
          <span class="eyebrow">分享图 · 1080×1440</span>
          <h2 id="share-modal-title">你的阵容分享图</h2>
        </div>
        <button ref="closeButton" type="button" aria-label="关闭分享图" @click="$emit('close')">
          ×
        </button>
      </header>
      <canvas
        ref="displayCanvas"
        class="share-modal__preview"
        :width="canvas?.width ?? 1080"
        :height="canvas?.height ?? 1440"
        aria-label="我的AI阵容分享图预览"
      ></canvas>
      <p>进入截图模式后不会显示按钮，使用系统截图即可保存。</p>
      <button class="share-modal__screenshot" type="button" @click="enterScreenshotMode">
        进入截图模式
      </button>
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
  padding: 10px;
  background: rgb(0 0 0 / 82%);
}

.share-modal__panel {
  width: min(100%, 440px);
  max-height: calc(100vh - 20px);
  max-height: calc(100dvh - 20px);
  overflow-y: auto;
  padding: 12px;
  border: 1px solid var(--color-border-strong);
  border-radius: 20px;
  background: var(--color-surface-1);
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
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
}

.share-modal__preview {
  display: block;
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.share-modal p {
  margin: 14px 0;
  text-align: center;
  font-size: 12px;
}

.share-modal__screenshot {
  width: 100%;
  min-height: 48px;
  border: 0;
  border-radius: 12px;
  color: var(--color-background);
  background: var(--color-accent);
  font-weight: 800;
}

.screenshot-view {
  position: fixed;
  z-index: 60;
  inset: 0;
  display: grid;
  overflow: hidden;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  place-items: center;
  padding:
    var(--safe-area-inset-top, env(safe-area-inset-top, 0px))
    0
    var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px));
  background: #0b0d12;
}

.screenshot-view canvas {
  display: block;
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
