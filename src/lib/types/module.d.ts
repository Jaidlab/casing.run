/// <reference types="vite/client" />

declare module 'postcss-normalize' {
  import type {PluginCreator} from 'postcss'
  const plugin: PluginCreator<{allowDuplicates?: boolean, forceImport?: boolean | string}>
  export default plugin
}

declare module '*.module.sass' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.sass' {
  const content: string
  export default content
}
