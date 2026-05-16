import clsx from 'clsx'
import {useState} from 'react'

import {casings} from '#src/lib/casings.ts'

import css from './style.module.sass'

const placeholderText = 'Enter some text'

export default function App() {
  const [text, setText] = useState('')
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value)
  }
  const hasText = Boolean(text.trim().length)
  const items = Object.entries(casings).map(([key, casing]) => {
    const value = casing.convert(text)
    const isEqual = value === text.trim()
    return <div key={key} className={clsx(css.item, css[casing.category], hasText && isEqual && css.equal)}>
      <div className={css.header}>
        <span className={css.button}>󱉨</span>
        <span className={css.name}>{casing.id}</span>
      </div>
      <input type='text' className={css.result} value={value} placeholder={casing.convert(placeholderText)} readOnly />
    </div>
  })
  return <>
    <div className={css.inputWrapper}>
      <input type="text" className={css.input} placeholder={placeholderText} value={text} onChange={onChange} autoFocus />
    </div>
    <div className={css.arrow}>
      change casing
    </div>
    <div className={css.arrow}>
      ↓
    </div>
    {items}
  </>
}
