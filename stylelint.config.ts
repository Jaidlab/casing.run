import type {Config} from 'stylelint'

const config: Config = {
  customSyntax: 'postcss-scss',
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'color-no-invalid-hex': true,
  },
}

export default config
