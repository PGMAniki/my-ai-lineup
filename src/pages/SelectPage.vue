<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import CaptainPicker from '../components/CaptainPicker.vue'
import CategoryTabs from '../components/CategoryTabs.vue'
import SelectedTray from '../components/SelectedTray.vue'
import ToolCard from '../components/ToolCard.vue'
import { TOOLS } from '../config/tools'
import { filterTools, type CategoryFilter } from '../core/toolSearch'
import { useSelection } from '../composables/useSelection'
import { encodeResultParams } from '../core/resultCodec'

const query = ref('')
const activeCategory = ref<CategoryFilter>('all')
const feedback = ref('')
const isCaptainPickerOpen = ref(false)
const router = useRouter()

const {
  selectedTools,
  canGenerate,
  remainingRequired,
  captainId,
  isSelected,
  toggleTool,
  setCaptain,
  toUserSelection,
} = useSelection()

const visibleTools = computed(() => filterTools(TOOLS, query.value, activeCategory.value))

const handleToggle = (toolId: string): void => {
  const result = toggleTool(toolId)
  feedback.value = result.message ?? ''
}

const handleGenerate = (): void => {
  if (!canGenerate.value) return
  feedback.value = ''
  isCaptainPickerOpen.value = true
}

const handleCaptainConfirm = async (selectedCaptainId: string): Promise<void> => {
  if (!setCaptain(selectedCaptainId)) {
    feedback.value = '本命工具必须来自已选阵容。'
    return
  }

  const selection = toUserSelection()
  if (!selection) {
    feedback.value = '阵容信息不完整，请重新选择。'
    return
  }

  isCaptainPickerOpen.value = false
  await router.push({ path: '/result', query: encodeResultParams(selection) })
}
</script>

<template>
  <main class="page select-page">
    <header class="select-page__header">
      <RouterLink class="back-link" to="/" aria-label="返回首页">←</RouterLink>
      <div>
        <span class="eyebrow">AI LINEUP / SELECT</span>
        <h1>选择你的AI工具</h1>
      </div>
    </header>

    <p class="select-page__intro">只选你真正使用过、并愿意放进日常工作流的工具。</p>

    <label class="search-field">
      <span class="sr-only">搜索AI工具</span>
      <span aria-hidden="true">⌕</span>
      <input v-model="query" type="search" placeholder="搜索ChatGPT、Codex、Seedance……" />
    </label>

    <CategoryTabs v-model="activeCategory" />

    <p v-if="feedback" class="select-page__feedback" role="status">{{ feedback }}</p>

    <section v-if="visibleTools.length" class="tool-grid" aria-label="AI工具列表">
      <ToolCard
        v-for="tool in visibleTools"
        :key="tool.id"
        :tool="tool"
        :selected="isSelected(tool.id)"
        @toggle="handleToggle"
      />
    </section>

    <section v-else class="empty-state">
      <strong>暂时没有找到这款工具。</strong>
      <span>首发版本会持续补充热门AI产品。</span>
    </section>

    <SelectedTray
      :tools="selectedTools"
      :can-generate="canGenerate"
      :remaining-required="remainingRequired"
      @remove="handleToggle"
      @generate="handleGenerate"
    />

    <CaptainPicker
      v-if="isCaptainPickerOpen"
      :tools="selectedTools"
      :initial-captain-id="captainId"
      @close="isCaptainPickerOpen = false"
      @confirm="handleCaptainConfirm"
    />
  </main>
</template>

<style scoped>
.select-page {
  padding-bottom: 150px;
}

.select-page__header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.select-page__header h1 {
  margin: 4px 0 0;
  font-size: clamp(26px, 8vw, 36px);
}

.back-link {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  color: var(--color-text);
  text-decoration: none;
}

.select-page__intro {
  margin-bottom: 20px;
  font-size: 13px;
}

.search-field {
  display: flex;
  min-height: 50px;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  padding: 0 15px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  color: var(--color-text-secondary);
  background: var(--color-surface-1);
}

.search-field:focus-within {
  border-color: var(--color-blue);
}

.search-field input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: var(--color-text);
  background: transparent;
  font: inherit;
  font-size: 14px;
}

.search-field input::placeholder {
  color: #697284;
}

.select-page__feedback {
  margin: 10px 0 14px;
  padding: 10px 12px;
  border: 1px solid rgb(255 180 84 / 25%);
  border-radius: 10px;
  color: var(--color-warning);
  background: rgb(255 180 84 / 7%);
  font-size: 12px;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.empty-state {
  display: flex;
  min-height: 220px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--color-text-secondary);
  text-align: center;
}

.empty-state strong {
  color: var(--color-text);
}

.empty-state span {
  font-size: 13px;
}
</style>
