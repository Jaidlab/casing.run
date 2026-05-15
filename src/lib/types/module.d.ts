/// <reference types="vite/client"/>

declare module 'postcss-normalize' {
  import type {PluginCreator} from 'postcss'

  type PluginSchema = {
    allowDuplicates?: boolean
    forceImport?: boolean | string
  }
  const plugin: PluginCreator<PluginSchema>
  export default plugin
}
declare module '#root/package.json' {
  import type {PackageJson} from 'type-fest'

  const content: PackageJson
  export default content
}
declare module '*.module.sass' {
  const classes: Record<string, string>
  export default classes
}
declare module '*.sass' {
  const content: string
  export default content
}
