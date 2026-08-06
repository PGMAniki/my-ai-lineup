<script setup lang="ts">
import type { ToolDefinition } from '../types'

defineProps<{
  tool: ToolDefinition
  selected: boolean
}>()

defineEmits<{
  toggle: [toolId: string]
}>()
</script>

<template>
  <button
    class="tool-card"
    :class="{ 'tool-card--selected': selected }"
    type="button"
    :aria-pressed="selected"
    :aria-label="`${selected ? '取消选择' : '选择'}${tool.name}`"
    @click="$emit('toggle', tool.id)"
  >
    <span v-if="selected" class="tool-card__check" aria-hidden="true">✓</span>
    <span class="tool-card__name">{{ tool.name }}</span>
    <span class="tool-card__description">{{ tool.description }}</span>
  </button>
</template>

<style scoped>
.tool-card {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 120px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  color: inherit;
  background: var(--color-surface-1);
  text-align: left;
  cursor: pointer;
  transition: border-color 160ms ease, background-color 160ms ease, transform 160ms ease;
}

.tool-card:active {
  transform: scale(0.985);
}

.tool-card:focus-visible {
  outline: 2px solid var(--color-blue);
  outline-offset: 2px;
}

.tool-card--selected {
  border-color: var(--color-accent);
  background: linear-gradient(145deg, rgb(132 255 106 / 9%), var(--color-surface-1));
}

.tool-card__check {
  position: absolute;
  top: 12px;
  right: 12px;
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  border-radius: 50%;
  color: var(--color-background);
  background: var(--color-accent);
  font-size: 13px;
  font-weight: 900;
}

.tool-card__name {
  overflow: hidden;
  width: 100%;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 750;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tool-card__description {
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.45;
}

@media (prefers-reduced-motion: reduce) {
  .tool-card {
    transition: none;
  }
}
</style>
