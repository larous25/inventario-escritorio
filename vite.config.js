import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'

export default defineConfig({
  plugins: [
    vue(),
    electron([
      {
        // Configuración para el proceso MAIN
        entry: 'electron/index.js',
      },
      {
        // Configuración para el proceso PRELOAD
        entry: 'electron/preload.js',
        onstart(options) {
          // Recarga la ventana cuando cambia el preload, sin reiniciar Electron
          options.reload()
        },
      },
    ]),
  ],
  // build: {
  //   outDir: 'dist', // Por defecto es 'dist', no suele necesitar cambiarse
  // },
  base: './', // Importante para que las rutas funcionen en producción
  resolve: {
    extensions: ['.js', '.ts', '.vue', '.json']
  }
})