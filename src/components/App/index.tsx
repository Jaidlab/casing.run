import {useState} from 'react'
import {casings} from '#src/lib/casings.ts'
import css from './style.module.sass'

export default function App() {
  const [text, setText] = useState('')

  const entries = Object.entries(casings) as Array<[string, typeof casings[keyof typeof casings]]>

  return <main className={css.container}>
    <header className={css.header}>
      <h1 className={css.title}>Casings</h1>
      <p className={css.subtitle}>
        Enter text to see it transformed into {entries.length} different casings in real time.
      </p>
    </header>
    <div className={css.inputWrapper}>
      <input
        type="text"
        className={css.input}
        placeholder="Enter some text…"
        value={text}
        onChange={event => { setText(event.target.value) }}
        autoFocus
      />
    </div>
    <ul className={css.list}>
      {entries.map(([key, casing]) => (
        <li key={key} className={css.item}>
          <span className={css.name}>{casing.name}</span>
          <output className={css.result}>{casing.convert(text)}</output>
        </li>
      ))}
    </ul>
  </main>
}
