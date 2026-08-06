<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { ToolDefinition } from '../types'

const props = defineProps<{
  tools: ToolDefinition[]
  initialCaptainId?: string
}>()

const emit = defineEmits<{
  close: []
  confirm: [captainId: string]
}>()

const selectedCaptainId = ref(props.initialCaptainId ?? '')
const firstOption = ref<HTMLButtonElement>()

onMounted(async () => {
  document.body.style.overflow = 'hidden'
  await nextTick()
  firstOption.value?.focus()
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})

const confirm = (): void => {
  if (selectedCaptainId.value) emit('confirm', selectedCaptainId.value)
}
</script>

<template>
  <div class="captain-picker" @click.self="$emit('close')">
    <section
      class="captain-picker__panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="captain-picker-title"
      @keydown.esc="$emit('close')"
    >
      <div class="captain-picker__handle" aria-hidden="true"></div>
      <header class="captain-picker__header">
        <div>
          <span class="eyebrow">CAPTAIN / 核心位</span>
          <h2 id="captain-picker-title">谁是你最离不开的AI？</h2>
          <p>本命会对最终结果产生更高影响。</p>
        </div>
        <button class="captain-picker__close" type="button" aria-label="关闭本命选择" @click="$emit('close')">×</button>
      </header>

      <div class="captain-picker__grid" role="radiogroup" aria-label="选择本命AI">
        <button
          v-for="(tool, index) in tools"
          :key="tool.id"
          :ref="(element) => { if (index === 0) firstOption = element as HTMLButtonElement }"
          class="captain-option"
          :class="{ 'captain-option--selected': selectedCaptainId === tool.id }"
          type="button"
          role="radio"
          :aria-checked="selectedCaptainId === tool.id"
          @click="selectedCaptainId = tool.id"
        >
          <span>{{ tool.name }}</span>
          <span v-if="selectedCaptainId === tool.id" class="captain-option__check" aria-hidden="true">✓</span>
        </button>
      </div>

      <button class="captain-picker__confirm" type="button" :disabled="!selectedCaptainId" @click="confirm">
        就是它，生成结果
      </button>
    </section>
  </div>
</template>

<style scoped>
.captain-picker {
  position: fixed;
  z-index: 40;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 16px 16px 0;
  background: rgb(0 0 0 / 70%);
}

.captain-picker__panel {
  width: min(100%, 520px);
  max-height: min(82vh, 720px);
  overflow-y: auto;
  padding:
    10px
    18px
    calc(18px + var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)));
  border: 1px solid var(--color-border-strong);
  border-bottom: 0;
  border-radius: 24px 24px 0 0;
  background: var(--color-surface-1);
  box-shadow: 0 -24px 80px rgb(0 0 0 / 45%);
}

.captain-picker__handle {
  width: 42px;
  height: 4px;
  margin: 0 auto 20px;
  border-radius: 999px;
  background: var(--color-border-strong);
}

.captain-picker__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.captain-picker__header h2 {
  margin: 6px 0 8px;
  font-size: 24px;
  line-height: 1.15;
}

.captain-picker__header p {
  margin: 0 0 18px;
  font-size: 13px;
}

.captain-picker__close {
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  color: var(--color-text-secondary);
  background: transparent;
  font-size: 24px;
  cursor: pointer;
}

.captain-picker__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.captain-option {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 64px;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  color: var(--color-text);
  background: var(--color-surface-2);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}

.captain-option--selected {
  border-color: var(--color-accent);
  background: rgb(132 255 106 / 8%);
}

.captain-option__check {
  position: absolute;
  top: 8px;
  right: 8px;
  color: var(--color-accent);
}

.captain-option:focus-visible,
.captain-picker__close:focus-visible,
.captain-picker__confirm:focus-visible {
  outline: 2px solid var(--color-blue);
  outline-offset: 2px;
}

.captain-picker__confirm {
  width: 100%;
  min-height: 52px;
  margin-top: 16px;
  border: 0;
  border-radius: 14px;
  color: var(--color-background);
  background: var(--color-accent);
  font: inherit;
  font-weight: 850;
  cursor: pointer;
}

.captain-picker__confirm:disabled {
  color: var(--color-text-secondary);
  background: #272d38;
  cursor: not-allowed;
}
</style>
