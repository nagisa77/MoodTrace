import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
  ? '/MoodTrace/' 
  : '/',
  plugins: [vue()],
})
