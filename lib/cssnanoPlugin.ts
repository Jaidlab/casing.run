import type {AcceptedPlugin} from 'postcss'

import postcssCssnano from 'cssnano-preset-advanced'

const cssnanoPlugins = postcssCssnano().plugins.map(([createPlugin, options]) => createPlugin(options)) as Array<AcceptedPlugin>

export default cssnanoPlugins
