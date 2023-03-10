import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 需要安装@types/node

export default defineConfig({
  mode: 'development', // 配置环境
  resolve: {
    extensions:['.ts', '.vue', '.tsx'],
    'alias': {
      '@': path.resolve(__dirname, 'src') 
    }
  },
  base:'./',
  server: {
    port: 5555,
    host: '0.0.0.0', // 配置ip 可以本地ip访问到项目
    open: true,
    // proxy: {
    //   '': {
    //     target: 'http://114.116.29.38:8089',
    //     changeOrigin: true,
    //     // rewrite: (path) => path.replace(/^\/api/, '')
    //  },
    // }
  }, 
  build: {
    sourcemap: false
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData:
  //       '@import "@/styles/global.scss";'
  //     }
  //   }
  // },
  plugins: [
    vue()
  ]
})
