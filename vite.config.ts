import type {PluginOption, UserConfig} from 'vite'
import babelPlugin from '@rolldown/plugin-babel'
import reactPlugin, {reactCompilerPreset} from '@vitejs/plugin-react'
import {defineConfig} from 'vite'
import {VitePWA} from 'vite-plugin-pwa'
import packageJson from './package.json' with {type: 'json'}
import titlePlugin from '#root/lib/titlePlugin.ts'
import postcssCssnano from 'cssnano-preset-advanced'
import postcssAutoprefixer from 'autoprefixer'
import postcssNormalize from 'postcss-normalize'

export default defineConfig(context => {
  const basePlugins: Array<PluginOption> = [
    titlePlugin(),
    reactPlugin(),
    babelPlugin({
      presets: [reactCompilerPreset()]
    })
  ]
  const baseBuildConfig: UserConfig['build'] = {
    target: 'chrome147',
    outDir: `dist/${context.mode}`
  }
  if (context.mode !== 'production') {
    return {
      plugins: basePlugins,
      build: baseBuildConfig
    }
  }
  const pwaPlugin = VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: packageJson.displayName || packageJson.name,
      short_name: packageJson.displayName || packageJson.name,
      description: (packageJson as Record<string, unknown>).description as string | undefined,
      theme_color: '#000',
      background_color: '#000',
      display: 'standalone',
      icons: [
        {src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any'},
        {src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable'}
      ],
    },
    workbox: {
      globPatterns: ['*.{js,css,html,svg}']
    },
  })

  // cssnano-preset-advanced returns plugins as [pluginFn, options] tuples,
  // but this version of PostCSS doesn't support that format. Call each fn with its opts.
  const cssnanoPlugins = postcssCssnano().plugins.map(([fn, opts]: [Function, unknown]) => fn(opts))

  return {
    plugins: [
      ...basePlugins,
      pwaPlugin
    ],
    build: {
      ...baseBuildConfig,
      assetsDir: '',
      emptyOutDir: true
    },
    css: {
      postcss: {
        plugins: [
          postcssNormalize(),
          postcssAutoprefixer,
          ...cssnanoPlugins
        ]
      } as any
    }
  }
})
