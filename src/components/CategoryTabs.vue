<script setup lang="ts">
import type { CategoryFilter } from '../core/toolSearch'

defineProps<{
  modelValue: CategoryFilter
}>()

defineEmits<{
  'update:modelValue': [category: CategoryFilter]
}>()

const categories: ReadonlyArray<{ value: CategoryFilter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'general', label: '通用' },
  { value: 'research', label: '研究' },
  { value: 'coding', label: '编程' },
  { value: 'image', label: '图像' },
  { value: 'video', label: '视频' },
  { value: 'audio', label: '音频' },
  { value: 'agent', label: 'Agent' },
]
</script>

<template>
  <nav class="category-tabs" aria-label="工具分类">
    <button
      v-for="category in categories"
      :key="category.value"
      class="category-tabs__item"
      :class="{ 'category-tabs__item--active': modelValue === category.value }"
      type="button"
      @click="$emit('update:modelValue', category.value)"
    >
      {{ category.label }}
    </button>
  </nav>
</template>

<style scoped>
.category-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 0 8px;
  scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tabs__item {
  min-width: max-content;
  min-height: 44px;
  padding: 0 15px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-text-secondary);
  background: transparent;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.category-tabs__item--active {
  border-color: var(--color-accent);
  color: var(--color-background);
  background: var(--color-accent);
  font-weight: 700;
}

.category-tabs__item:focus-visible {
  outline: 2px solid var(--color-blue);
  outline-offset: 2px;
}
</style>
