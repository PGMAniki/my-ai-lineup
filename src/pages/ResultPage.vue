<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RadarChart from '../components/RadarChart.vue'
import ShareImageModal from '@share-image-modal'
import { copyText } from '@platform-actions'
import { useSelection } from '../composables/useSelection'
import { useShareImage } from '../composables/useShareImage'
import { IS_XIAOHONGSHU } from '../config/platform'
import { decodeResultParams } from '../core/resultCodec'
import { generateProfile } from '../core/profileGenerator'

const route = useRoute()
const router = useRouter()
const copyStatus = ref('')
const showH5ShareActions = !IS_XIAOHONGSHU
const { clearSelection } = useSelection()
const {
  isGenerating,
  error: shareError,
  previewUrl,
  previewCanvas,
  isWeChat,
  generate,
  closePreview,
} = useShareImage()

const resultState = computed(() => {
  try {
    const selection = decodeResultParams(route.query)
    return { profile: generateProfile(selection), error: '' }
  } catch (error) {
    return {
      profile: undefined,
      error: error instanceof Error ? error.message : '无法读取这份AI阵容。',
    }
  }
})

const recommendedShareText = computed(() => {
  const profile = resultState.value.profile
  if (!profile) return ''
  const text = `我的AI称号是「${profile.title}」，本命AI是${profile.captain.name}。你是哪种AI玩家？`
  return IS_XIAOHONGSHU ? text : `${text}\n${window.location.href}`
})

const copyResultLink = async (): Promise<void> => {
  try {
    await copyText(window.location.href)
    copyStatus.value = '结果链接已复制。'
  } catch {
    copyStatus.value = '复制失败，请从浏览器地址栏复制当前链接。'
  }
}

const restart = async (): Promise<void> => {
  clearSelection()
  await router.push('/select')
}
</script>

<template>
  <main class="page result-page">
    <template v-if="resultState.profile">
      <header class="result-page__topbar">
        <div>
          <span class="eyebrow">MY AI LINEUP / IDENTITY FILE</span>
          <strong>我的AI阵容</strong>
        </div>
        <span class="result-page__version">RULES v{{ resultState.profile.rulesVersion }}</span>
      </header>

      <section class="identity-panel">
        <span class="identity-panel__index">PROFILE / {{ resultState.profile.resultHash.toUpperCase() }}</span>
        <p class="identity-panel__label">你的AI身份</p>
        <h1>{{ resultState.profile.title }}</h1>
        <p class="identity-panel__verdict">{{ resultState.profile.verdict }}</p>

        <div class="captain-card">
          <div>
            <span>CAPTAIN / 本命 AI</span>
            <strong>{{ resultState.profile.captain.name }}</strong>
          </div>
          <span class="captain-card__mark" aria-hidden="true">★</span>
        </div>
      </section>

      <section class="result-section radar-section">
        <header class="result-section__header">
          <div>
            <span class="section-index">01 / CAPABILITY MAP</span>
            <h2>六维能力版图</h2>
          </div>
          <span>TOP 3 WEIGHTED</span>
        </header>
        <RadarChart :scores="resultState.profile.dimensionScores" />
      </section>

      <section class="result-section">
        <header class="result-section__header">
          <div>
            <span class="section-index">02 / IDENTITY TAGS</span>
            <h2>身份标签</h2>
          </div>
        </header>
        <div class="identity-tags">
          <span v-for="label in resultState.profile.labels" :key="label"># {{ label }}</span>
        </div>
      </section>

      <section class="result-section">
        <header class="result-section__header">
          <div>
            <span class="section-index">03 / ACTIVE ROSTER</span>
            <h2>完整AI阵容</h2>
          </div>
          <span>{{ resultState.profile.selectedTools.length }} MEMBERS</span>
        </header>
        <div class="lineup-list">
          <div
            v-for="(tool, index) in resultState.profile.selectedTools"
            :key="tool.id"
            class="lineup-item"
            :class="{ 'lineup-item--captain': tool.id === resultState.profile.captain.id }"
          >
            <span class="lineup-item__index">{{ String(index + 1).padStart(2, '0') }}</span>
            <div>
              <strong>{{ tool.name }}</strong>
              <span>{{ tool.description }}</span>
            </div>
            <span v-if="tool.id === resultState.profile.captain.id" class="lineup-item__role">本命</span>
          </div>
        </div>
      </section>

      <aside class="result-disclaimer">
        <span aria-hidden="true">i</span>
        <p>六维结果根据所选工具的主要用途进行娱乐化计算，不代表工具能力排名。</p>
      </aside>

      <nav class="result-actions" aria-label="结果操作">
        <button
          class="share-button"
          type="button"
          :disabled="isGenerating"
          @click="generate(resultState.profile)"
        >
          {{ isGenerating ? '正在生成分享图…' : '生成分享图' }}
        </button>
        <button v-if="showH5ShareActions" class="secondary-button" type="button" @click="copyResultLink">
          复制结果链接
        </button>
        <RouterLink class="secondary-button" to="/select">修改阵容</RouterLink>
        <button class="text-button" type="button" @click="restart">重新开始</button>
      </nav>
      <p v-if="copyStatus" class="action-status" role="status">{{ copyStatus }}</p>
      <p v-if="shareError" class="action-status action-status--error" role="alert">
        {{ shareError }}，可以直接截图当前结果。
      </p>

      <ShareImageModal
        v-if="previewUrl || previewCanvas"
        :image-url="previewUrl"
        :canvas="previewCanvas"
        :is-we-chat="isWeChat"
        :share-text="recommendedShareText"
        @close="closePreview"
      />
    </template>

    <template v-else>
      <section class="result-error">
        <span class="eyebrow">RESULT LINK ERROR</span>
        <h1>这份阵容无法还原</h1>
        <p>{{ resultState.error }}</p>
        <RouterLink class="primary-button" to="/select">重新选择工具</RouterLink>
      </section>
    </template>
  </main>
</template>

<style scoped>
.result-page {
  padding-top: 24px;
  padding-bottom: 48px;
}

.result-page__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-border);
}

.result-page__topbar > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.result-page__topbar strong {
  font-size: 14px;
}

.result-page__version,
.identity-panel__index,
.section-index {
  color: var(--color-text-secondary);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.identity-panel {
  position: relative;
  overflow: hidden;
  padding: 22px 18px 18px;
  border: 1px solid var(--color-border-strong);
  border-radius: 20px;
  background:
    linear-gradient(145deg, rgb(132 255 106 / 8%), transparent 46%),
    var(--color-surface-1);
}

.identity-panel::after {
  position: absolute;
  top: -38px;
  right: -38px;
  width: 110px;
  height: 110px;
  border: 1px solid rgb(132 255 106 / 15%);
  border-radius: 50%;
  box-shadow: 0 0 0 18px rgb(132 255 106 / 3%), 0 0 0 36px rgb(132 255 106 / 2%);
  content: '';
}

.identity-panel__label {
  margin: 24px 0 6px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.identity-panel h1 {
  position: relative;
  z-index: 1;
  max-width: 9em;
  margin-bottom: 12px;
  font-size: clamp(38px, 11vw, 56px);
  animation: title-enter 500ms 180ms ease-out both;
}

.identity-panel__verdict {
  position: relative;
  z-index: 1;
  max-width: 30em;
  margin-bottom: 20px;
  color: var(--color-text);
  font-size: 15px;
  line-height: 1.65;
}

.captain-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: rgb(11 13 18 / 70%);
}

.captain-card > div {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 3px;
}

.captain-card span {
  color: var(--color-text-secondary);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.09em;
}

.captain-card strong,
.captain-card__mark {
  color: var(--color-accent);
}

.captain-card__mark {
  font-size: 18px !important;
}

.result-section {
  margin-top: 14px;
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface-1);
}

.result-section__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.result-section__header > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.result-section__header h2 {
  margin: 0;
  font-size: 18px;
}

.result-section__header > span {
  color: var(--color-text-secondary);
  font-size: 9px;
  letter-spacing: 0.08em;
}

.radar-section {
  padding-bottom: 8px;
}

.identity-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.identity-tags span {
  padding: 9px 12px;
  border: 1px solid rgb(132 255 106 / 28%);
  border-radius: 999px;
  color: var(--color-accent);
  background: rgb(132 255 106 / 6%);
  font-size: 13px;
  font-weight: 700;
}

.lineup-list {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}

.lineup-item {
  display: grid;
  min-width: 0;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  align-items: center;
  gap: 9px;
  padding: 10px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: var(--color-surface-2);
}

.lineup-item--captain {
  border-color: rgb(132 255 106 / 35%);
}

.lineup-item__index {
  color: #687183;
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}

.lineup-item > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.lineup-item strong {
  overflow: hidden;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lineup-item > div > span {
  overflow: hidden;
  color: var(--color-text-secondary);
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lineup-item__role {
  color: var(--color-accent);
  font-size: 10px;
  font-weight: 800;
}

.result-disclaimer {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 14px;
  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
}

.result-disclaimer > span {
  display: grid;
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid var(--color-text-secondary);
  border-radius: 50%;
  color: var(--color-text-secondary);
  font-size: 11px;
}

.result-disclaimer p {
  margin: 0;
  font-size: 11px;
  line-height: 1.6;
}

.result-actions {
  display: grid;
  align-items: center;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.secondary-button,
.share-button,
.text-button {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.secondary-button {
  border: 1px solid var(--color-border-strong);
  border-radius: 12px;
  color: var(--color-text);
  background: transparent;
  text-decoration: none;
}

.share-button {
  grid-column: 1 / -1;
  border: 0;
  border-radius: 12px;
  color: var(--color-background);
  background: var(--color-accent);
  font-weight: 850;
}

.share-button:disabled {
  color: var(--color-text-secondary);
  background: var(--color-surface-2);
}

.text-button {
  border: 0;
  color: var(--color-text-secondary);
  background: transparent;
}

.action-status {
  margin: 12px 0 0;
  color: var(--color-accent);
  font-size: 12px;
  text-align: center;
}

.action-status--error {
  color: var(--color-warning);
}

.result-error {
  display: flex;
  min-height: calc(100vh - 64px);
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

@keyframes title-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .identity-panel h1 {
    animation: none;
  }
}
</style>
