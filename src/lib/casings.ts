export interface CasingDefinition {
  readonly category: 'dash' | 'space' | 'touching' | 'underscore'
  readonly convert: (text: string) => string
  readonly id: string
  readonly name: string
}

/**
 * Splits a string into words, handling various input formats.
 * Supports space, hyphen, underscore delimiters and camelCase/PascalCase splitting.
 */
export function splitWords(text: string): Array<string> {
  if (!text) {
    return ['']
  }
  // Split on common delimiters first
  const rawTokens = text.split(/[\s!,\-.:;?_]+/).filter(Boolean)
  if (rawTokens.length === 0) {
    return ['']
  }
  const result: Array<string> = []
  for (const token of rawTokens) {
    let current = ''
    for (let i = 0; i < token.length; i++) {
      const char = token[i]
      const prev = token[i - 1] ?? ''
      const next = token[i + 1] ?? ''
      if (current.length > 0) {
        // lowercase → uppercase boundary: "helloWorld" → "hello" | "World"
        if (isLower(prev) && isUpper(char)) {
          result.push(current)
          current = char
          continue
        }
        // UPPER + UPPER + lower boundary: "HTTPSCert" → "HTTPS" | "Cert"
        if (isUpper(prev) && isUpper(char) && isLower(next)) {
          result.push(current)
          current = char
          continue
        }
      }
      current += char
    }
    if (current) {
      result.push(current)
    }
  }
  return result.length > 0 ? result : ['']
}

export function camelCase(text: string): string {
  const words = splitWords(text).map(w => w.toLowerCase())
  if (words.length === 0) {
    return ''
  }
  return words[0] + words.slice(1).map(capitalize).join('')
}

export function pascalCase(text: string): string {
  return splitWords(text).map(w => capitalize(w.toLowerCase())).join('')
}

export function snakeCase(text: string): string {
  return splitWords(text).map(w => w.toLowerCase()).join('_')
}

export function constantCase(text: string): string {
  return splitWords(text).map(w => w.toUpperCase()).join('_')
}

export function kebabCase(text: string): string {
  return splitWords(text).map(w => w.toLowerCase()).join('-')
}

export function trainCase(text: string): string {
  return splitWords(text).map(w => capitalize(w.toLowerCase())).join('-')
}

export function cobolCase(text: string): string {
  return splitWords(text).map(w => w.toUpperCase()).join('-')
}

export function lowerCase(text: string): string {
  return splitWords(text).map(w => w.toLowerCase()).join(' ')
}

export function upperCase(text: string): string {
  return splitWords(text).map(w => w.toUpperCase()).join(' ')
}

export function titleCase(text: string): string {
  return splitWords(text).map(w => capitalize(w.toLowerCase())).join(' ')
}

export function sentenceCase(text: string): string {
  const words = splitWords(text).map(w => w.toLowerCase())
  if (words.length === 0) {
    return ''
  }
  return capitalize(words[0]) + (words.length > 1 ? ` ${words.slice(1).join(' ')}` : '')
}

function isUpper(c: string): boolean {
  return c >= 'A' && c <= 'Z'
}
function isLower(c: string): boolean {
  return c >= 'a' && c <= 'z'
}
function capitalize(word: string): string {
  if (!word) {
    return ''
  }
  return word[0].toUpperCase() + word.slice(1)
}

export const casings = {
  camelCase: {
    id: 'camel',
    name: 'camelCase',
    convert: camelCase,
    category: 'touching',
  },
  pascalCase: {
    id: 'pascal',
    name: 'PascalCase',
    convert: pascalCase,
    category: 'touching',
  },
  snakeCase: {
    id: 'snake',
    name: 'snake_case',
    convert: snakeCase,
    category: 'underscore',
  },
  constantCase: {
    id: 'constant',
    name: 'CONSTANT_CASE',
    convert: constantCase,
    category: 'underscore',
  },
  kebabCase: {
    id: 'kebab',
    name: 'kebab-case',
    convert: kebabCase,
    category: 'dash',
  },
  trainCase: {
    id: 'train',
    name: 'Train-Case',
    convert: trainCase,
    category: 'dash',
  },
  cobolCase: {
    id: 'cobol',
    name: 'COBOL-CASE',
    convert: cobolCase,
    category: 'dash',
  },
  lowerCase: {
    id: 'lower',
    name: 'lower case',
    convert: lowerCase,
    category: 'space',
  },
  sentenceCase: {
    id: 'sentence',
    name: 'Sentence case',
    convert: sentenceCase,
    category: 'space',
  },
  titleCase: {
    id: 'title',
    name: 'Title Case',
    convert: titleCase,
    category: 'space',
  },
  upperCase: {
    id: 'upper',
    name: 'UPPER CASE',
    convert: upperCase,
    category: 'space',
  },
} as const satisfies Record<string, CasingDefinition>
