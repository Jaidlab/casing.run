import postcssCssnano from 'cssnano-preset-advanced'

const cssnanoPlugins = postcssCssnano().plugins.map(([createPlugin, options]) => createPlugin(options))

export default cssnanoPlugins
