<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <button class="author-trigger" type="button" @click="isOpen = true">查看作者</button>

  <div v-if="isOpen" class="author-modal" @click.self="isOpen = false">
    <section role="dialog" aria-modal="true" aria-labelledby="author-modal-title">
      <header>
        <span>CREATOR</span>
        <button type="button" aria-label="关闭作者信息" @click="isOpen = false">×</button>
      </header>
      <h2 id="author-modal-title">关于作者</h2>
      <p>小红书搜索「刘道理」</p>
    </section>
  </div>
</template>

<style scoped>
.author-trigger {
  margin-top: 5px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-text-secondary);
  font: inherit;
  font-size: 10px;
  text-decoration: underline;
  text-decoration-color: rgb(255 255 255 / 20%);
  text-underline-offset: 3px;
}

.author-modal {
  position: fixed;
  z-index: 30;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgb(4 6 10 / 78%);
  backdrop-filter: blur(8px);
}

.author-modal section {
  width: min(100%, 340px);
  padding: 20px;
  border: 1px solid var(--color-border-strong);
  border-radius: 20px;
  background: var(--color-surface-1);
  box-shadow: 0 24px 80px rgb(0 0 0 / 45%);
}

.author-modal header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.author-modal header span {
  color: var(--color-accent);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.author-modal header button {
  display: grid;
  width: 36px;
  height: 36px;
  padding: 0;
  place-items: center;
  border: 1px solid var(--color-border-strong);
  border-radius: 12px;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 22px;
}

.author-modal h2 {
  margin: 16px 0 8px;
  font-size: 24px;
}

.author-modal p {
  margin: 0;
  color: var(--color-text);
  font-size: 16px;
}
</style>
