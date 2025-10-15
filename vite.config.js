import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

const resolve = (url) => path.resolve(__dirname, url)

// https://vite.dev/config/
export default defineConfig({
  base: './', // 使用相对路径，确保打包后可以在任何路径下正常访问
  server: {
    port: 5411,
  },
  resolve: {
    alias: {
      '@components': resolve('./src/components'),
      '@assets': resolve('./src/assets'),
      '@style': resolve('./src/style'),
      '@stores': resolve('./src/stores'),
      '@utils': resolve('./src/utils'),
      '@hooks': resolve('./src/hooks'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'], // 省略扩展名
  },
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
})
