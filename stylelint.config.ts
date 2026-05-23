import type {Config} from 'stylelint'

const config: Config = {
  customSyntax: 'postcss-scss',
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'color-no-invalid-hex': true,
    'scss/at-rule-no-unknown': [
      true, {
        ignoreAtRules: ['import-normalize', 'import-sanitize'],
      },
    ],
  },
}

export default config
