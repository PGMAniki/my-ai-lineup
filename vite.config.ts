import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isXiaohongshu = mode === 'xhs'

  return {
    base: isXiaohongshu ? './' : '/',
    plugins: [vue()],
    define: {
      __APP_TARGET__: JSON.stringify(isXiaohongshu ? 'xiaohongshu' : 'h5'),
    },
    resolve: {
      alias: {
        '@share-image-modal': fileURLToPath(
          new URL(
            isXiaohongshu
              ? './src/components/ShareImageModal.xhs.vue'
              : './src/components/ShareImageModal.vue',
            import.meta.url,
          ),
        ),
        '@platform-actions': fileURLToPath(
          new URL(
            isXiaohongshu
              ? './src/platform/actions.xhs.ts'
              : './src/platform/actions.h5.ts',
            import.meta.url,
          ),
        ),
      },
    },
    build: {
      outDir: isXiaohongshu ? 'dist/xhs' : 'dist/h5',
      emptyOutDir: true,
      modulePreload: { polyfill: !isXiaohongshu },
    },
    test: {
      environment: 'node',
    },
  }
})
