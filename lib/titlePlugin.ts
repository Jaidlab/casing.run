import type {Plugin} from 'vite'

import packageJson from '#root/package.json' with {type: 'json'}

export default function titlePlugin(): Plugin {
  return {
    name: 'vite-plugin-title',
    transformIndexHtml: {
      order: 'post',
      handler() {
        const title = String(packageJson.displayName || packageJson.name || 'App')
        return [{
          tag: 'title',
          children: title,
          injectTo: 'head-prepend'
        }]
      }
    }
  }
}
