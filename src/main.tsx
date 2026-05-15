import '#src/style.sass'

import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'

import App from '#src/components/App/index.tsx'

if (import.meta.env.DEV) {
  let rootNode = document.body.querySelector(':scope>div')
  if (!rootNode) {
    rootNode = document.createElement('div')
    document.body.append(rootNode)
  }
  const root = createRoot(rootNode)
  root.render(<StrictMode><App/></StrictMode>)
} else {
  const rootNode = document.createElement('div')
  document.body.append(rootNode)
  const root = createRoot(rootNode)
  root.render(<App/>)
}
