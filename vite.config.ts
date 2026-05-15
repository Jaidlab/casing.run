/* eslint new-cap: ["warn", {"capIsNewExceptions": ["VitePWA"]}] */

import type {PluginOption, UserConfig} from 'vite'

import babelPlugin from '@rolldown/plugin-babel'
import reactPlugin, {reactCompilerPreset} from '@vitejs/plugin-react'
import postcssAutoprefixer from 'autoprefixer'
import postcssNormalize from 'postcss-normalize'
import {defineConfig} from 'vite'
import {VitePWA} from 'vite-plugin-pwa'

import cssnanoPlugin from '#root/lib/cssnanoPlugin.ts'
import titlePlugin from '#root/lib/titlePlugin.ts'
import packageJson from '#root/package.json'

export default defineConfig(context => {
  const basePlugins: Array<PluginOption> = [
    titlePlugin(),
    reactPlugin(),
    babelPlugin({
      presets: [reactCompilerPreset()],
    }),
  ]
  const baseBuildConfig: UserConfig['build'] = {
    target: 'chrome147',
    outDir: `dist/${context.mode}`,
  }
  if (context.mode !== 'production') {
    return {
      plugins: basePlugins,
      build: baseBuildConfig,
      css: {
        postcss: {
          plugins: [postcssNormalize()],
        },
      },
    }
  }
  const title = (packageJson.displayName || packageJson.name) as string
  const pwaPlugin = VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: title,
      short_name: title,
      description: packageJson.description,
      theme_color: '#000',
      background_color: '#000',
      display: 'standalone',
      icons: [
        {
          src: 'icon.svg',
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any',
        },
        {
          src: 'icon.svg',
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['*.{js,css,html,svg}'],
    },
  })
  return {
    plugins: [
      ...basePlugins,
      pwaPlugin,
    ],
    build: {
      ...baseBuildConfig,
      assetsDir: '',
      emptyOutDir: true,
    },
    css: {
      postcss: {
        plugins: [
          postcssNormalize(),
          postcssAutoprefixer,
          ...cssnanoPlugin,
        ],
      },
    },
  }
})
