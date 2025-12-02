import path from 'path'
import pkg from './package.json'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import autoImportApi from 'unplugin-auto-import/vite'
import autoInjectComponents from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { zippyInjectComponetName } from "@zippybee/plugin-component-name"
import { RouteSceanConfig } from "./src/config/setting"
// import { visualizer } from "rollup-plugin-visualizer"

// 手动分包优化
const chunksObj: Record<string, string[]> = {}
Object.keys(pkg.dependencies).map(item => {
  if (['vue', 'vue-router', 'naive-ui'].includes(item)) {
    chunksObj[item] = [item]
  }
})

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    zippyInjectComponetName(RouteSceanConfig),
    VueDevTools(),
    vue(),
    vueJsx(),
    tailwindcss(),
    autoImportApi({
      dts: './types/auto-imports.d.ts',
      imports: ['vue', 'vue-router',
        {
          'naive-ui': ['useMessage', 'useDialog', 'useNotification', 'useLoadingBar']
        }
      ],
    }),
    autoInjectComponents(
      {
        dts: './types/components.d.ts',
        resolvers: [NaiveUiResolver()]
      }
    ),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets')],
      symbolId: 'icon-[dir]-[name]',
    }),
    Icons({ autoInstall: true }),

    // visualizer({
    //   gzipSize: true,
    //   brotliSize: true,
    //   emitFile: false,
    //   filename: "test.html", //分析图生成的文件名
    //   open: true //如果存在本地服务端口，将在打包后自动展示
    // }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: chunksObj,
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
      }
    }
  }
})
