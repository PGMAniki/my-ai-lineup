<script setup lang="ts">
import type { ToolDefinition } from '../types'

defineProps<{
  tools: ToolDefinition[]
  canGenerate: boolean
  remainingRequired: number
}>()

defineEmits<{
  remove: [toolId: string]
  generate: []
}>()
</script>

<template>
  <aside class="selected-tray" aria-label="已选AI阵容">
    <div class="selected-tray__inner">
      <div class="selected-tray__summary">
        <div class="selected-tray__heading">
          <strong>已选 {{ tools.length }}/8</strong>
          <span v-if="remainingRequired > 0">再选{{ remainingRequired }}款</span>
          <span v-else>阵容已就绪</span>
        </div>
        <div v-if="tools.length" class="selected-tray__tools">
          <button
            v-for="tool in tools"
            :key="tool.id"
            class="selected-tray__tool"
            type="button"
            :aria-label="`移除${tool.name}`"
            @click="$emit('remove', tool.id)"
          >
            <span>{{ tool.shortName }}</span>
          </button>
        </div>
        <span v-else class="selected-tray__empty">从上方选择你真正使用的工具</span>
      </div>
      <button
        class="selected-tray__button"
        type="button"
        :disabled="!canGenerate"
        @click="$emit('generate')"
      >
        生成我的AI身份
      </button>
    </div>
  </aside>
</template>

<style scoped>
.selected-tray {
  position: fixed;
  z-index: 20;
  right: 0;
  bottom: 0;
  left: 0;
  padding:
    12px
    16px
    calc(12px + var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)));
  border-top: 1px solid var(--color-border);
  background: rgb(11 13 18 / 94%);
  backdrop-filter: blur(14px);
}

.selected-tray__inner {
  display: grid;
  width: min(100%, 520px);
  margin: 0 auto;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
}

.selected-tray__summary {
  min-width: 0;
}

.selected-tray__heading {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 7px;
}

.selected-tray__heading strong {
  font-size: 13px;
}

.selected-tray__heading span,
.selected-tray__empty {
  color: var(--color-text-secondary);
  font-size: 11px;
}

.selected-tray__tools {
  display: flex;
  gap: 5px;
  overflow: hidden;
}

.selected-tray__tool {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--color-text-secondary);
  font: inherit;
  font-size: 10px;
  cursor: pointer;
}

.selected-tray__tool span {
  overflow: hidden;
  max-width: 44px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selected-tray__tool:focus-visible {
  outline: 2px solid var(--color-blue);
  outline-offset: 2px;
}

.selected-tray__button {
  min-height: 48px;
  padding: 0 17px;
  border: 0;
  border-radius: 12px;
  color: var(--color-background);
  background: var(--color-accent);
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.selected-tray__button:disabled {
  color: var(--color-text-secondary);
  background: var(--color-surface-2);
  cursor: not-allowed;
}

@media (max-width: 359px) {
  .selected-tray__button {
    max-width: 126px;
    padding: 0 12px;
  }
}
</style>
