import type {PackageJson} from 'type-fest'
import type {Plugin} from 'vite'

export default async function titlePlugin(title?: string) {
  const packageJson = await Bun.file('package.json').json() as PackageJson
  const resolvedTitle = (title || packageJson.displayName || packageJson.name) as string | undefined
  const plugin: Plugin = {
    name: 'vite-plugin-title',
  }
  if (resolvedTitle) {
    plugin.transformIndexHtml = () => [
      {
        tag: 'title',
        children: resolvedTitle,
        injectTo: 'head-prepend',
      },
    ]
  }
  return plugin
}
