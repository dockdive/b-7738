
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // Make Supabase variables available
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || "https://houhjguqdfolfqnzbkrs.supabase.co"),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdWhqZ3VxZGZvbGZxbnpia3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNjkwMjYsImV4cCI6MjA1Njk0NTAyNn0.P3Pis60wqIGniZftExxYOL6xBQ8JHKTQdHlZ0AsdkD0"),
    },
    // Add this to ensure environment variables are properly loaded during development
    build: {
      sourcemap: true,
    }
  }
})
