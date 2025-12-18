const { defineConfig } = require('vite')

module.exports = async () => {
  const react = (await import('@vitejs/plugin-react')).default
  return defineConfig({
    plugins: [react()],
    server: {
      port: 5173
    }
  })
}