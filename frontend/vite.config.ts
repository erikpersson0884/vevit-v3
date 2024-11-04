import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv';

// https://vitejs.dev/config/
dotenv.config();

console.log(process.env.API_URL);
console.log(process.env.PORT);

export default defineConfig({
  server: {
    port: parseInt(process.env.PORT || '3000'),
    proxy: {
      '/api/': {
        target: process.env.API_URL,
        changeOrigin: true,
        secure: false,
      }
    }
  },  

  plugins: [react()],
})
