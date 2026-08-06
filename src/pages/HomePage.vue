<script setup lang="ts">
import { TOOL_BY_ID } from '../config/tools'

const sampleTools = ['chatgpt', 'perplexity', 'codex', 'midjourney', 'seedance'].flatMap((id) => {
  const tool = TOOL_BY_ID.get(id)
  return tool ? [tool] : []
})
</script>

<template>
  <main class="page home-page">
    <header class="home-page__topbar">
      <div class="home-page__brand">
        <span aria-hidden="true">AI</span>
        <strong>我的AI阵容</strong>
      </div>
      <span>NO LOGIN / LOCAL ONLY</span>
    </header>

    <section class="home-hero">
      <span class="eyebrow">BUILD YOUR AI LINEUP</span>
      <h1>组建你的<br /><em>AI阵容</em></h1>
      <p>选出你真正使用的AI工具，看看你是哪种AI玩家。</p>
      <RouterLink class="primary-button home-hero__button" to="/select">
        <span>开始组队</span>
        <span aria-hidden="true">→</span>
      </RouterLink>
      <div class="home-hero__meta">
        <span>3–8 款工具</span>
        <span>指定 1 款本命</span>
        <span>本地生成结果</span>
      </div>
    </section>

    <section class="sample-card" aria-label="示例AI阵容">
      <header>
        <div>
          <span class="section-index">SAMPLE / IDENTITY FILE</span>
          <strong>示例阵容</strong>
        </div>
        <span>5 MEMBERS</span>
      </header>

      <div class="sample-card__identity">
        <div>
          <span>可能生成的身份</span>
          <h2>六边形AI个体户</h2>
        </div>
        <svg viewBox="0 0 120 120" role="img" aria-label="示例六维能力图装饰">
          <polygon points="60,10 103,35 103,85 60,110 17,85 17,35" />
          <polygon class="sample-card__radar" points="60,22 92,42 96,81 60,98 27,78 22,38" />
        </svg>
      </div>

      <div class="sample-card__tools">
        <div v-for="tool in sampleTools" :key="tool.id">
          <span>{{ tool.shortName }}</span>
        </div>
      </div>
    </section>

    <footer class="home-page__footer">
      <p>无需登录，不收集个人信息，结果仅供娱乐。</p>
      <p>你的选择和结果默认只保存在当前浏览器中，不会上传到服务器。</p>
    </footer>
  </main>
</template>

<style scoped>
.home-page {
  display: block;
  padding-top: 22px;
  padding-bottom: calc(28px + var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)));
}

.home-page__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.home-page__brand {
  display: flex;
  align-items: center;
  gap: 9px;
}

.home-page__brand > span {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid var(--color-accent);
  border-radius: 9px;
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 900;
}

.home-page__brand strong {
  font-size: 14px;
}

.home-page__topbar > span {
  color: var(--color-text-secondary);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.home-hero {
  padding: clamp(46px, 15vw, 76px) 0 32px;
}

.home-hero h1 {
  margin: 13px 0 18px;
  font-size: clamp(50px, 16vw, 76px);
  line-height: 0.94;
}

.home-hero h1 em {
  color: var(--color-accent);
  font-style: normal;
}

.home-hero > p {
  max-width: 27em;
  margin-bottom: 24px;
  font-size: 15px;
}

.home-hero__button {
  width: 100%;
  justify-content: space-between;
  min-height: 56px;
  padding: 0 20px;
}

.home-hero__button span:last-child {
  font-size: 22px;
}

.home-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 7px 14px;
  margin-top: 15px;
  color: var(--color-text-secondary);
  font-size: 10px;
}

.home-hero__meta span::before {
  margin-right: 5px;
  color: var(--color-accent);
  content: '•';
}

.sample-card {
  overflow: hidden;
  padding: 17px;
  border: 1px solid var(--color-border-strong);
  border-radius: 20px;
  background:
    linear-gradient(135deg, rgb(122 156 255 / 6%), transparent 55%),
    var(--color-surface-1);
}

.sample-card > header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.sample-card > header > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sample-card > header strong {
  font-size: 17px;
}

.sample-card > header > span {
  color: var(--color-text-secondary);
  font-size: 8px;
  letter-spacing: 0.1em;
}

.sample-card__identity {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 105px;
  align-items: center;
  gap: 10px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--color-border);
}

.sample-card__identity span {
  color: var(--color-text-secondary);
  font-size: 10px;
}

.sample-card__identity h2 {
  margin: 7px 0 0;
  font-size: clamp(22px, 7vw, 30px);
}

.sample-card__identity svg polygon {
  fill: none;
  stroke: rgb(255 255 255 / 14%);
}

.sample-card__identity svg {
  display: block;
  width: 100%;
  max-width: 105px;
  height: auto;
  justify-self: end;
  overflow: hidden;
}

.sample-card__identity .sample-card__radar {
  fill: rgb(132 255 106 / 12%);
  stroke: var(--color-accent);
  stroke-width: 2;
}

.sample-card__tools {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
  margin-top: 16px;
}

.sample-card__tools > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 5px 3px;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.sample-card__tools span {
  overflow: hidden;
  width: 100%;
  color: var(--color-text-secondary);
  color: var(--color-text);
  font-size: 9px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-page__footer {
  margin-top: 18px;
  padding: 14px 2px 0;
  border-top: 1px solid var(--color-border);
}

.home-page__footer p {
  margin: 0 0 5px;
  font-size: 10px;
  line-height: 1.55;
}
</style>
