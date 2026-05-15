import type {Browser, Page} from 'puppeteer-core'

import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, test} from 'bun:test'

import countPixels from 'count-in-png'
import puppeteer from 'puppeteer-core'

import screenshot from './lib/screenshot.ts'
import ViteSession from './lib/ViteSession.ts'

describe.if(Boolean(Bun.env.target)).each(['chrome', 'firefox'])('%s', host => {
  let vite: ViteSession
  let page: Page
  let browser: Browser
  beforeAll(async () => {
    vite = new ViteSession({
      root: Bun.env.target,
    })
    await vite.init()
    browser = await puppeteer.launch({
      browser: host,
      executablePath: Bun.which(host)!,
      defaultViewport: {
        width: 1920,
        height: 960,
      },
      args: host === 'chrome' ? [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--enable-font-antialiasing',
        '--font-render-hinting=medium',
        '--flag-switches-begin',
        '--enable-experimental-web-platform-features',
        '--enable-features=JXLImageFormat,OverlayScrollbar',
        '--flag-switches-end',
      ] : undefined,
    })
  })
  afterAll(async () => {
    await vite?.[Symbol.asyncDispose]()
    await browser?.close()
  })
  beforeEach(async () => {
    page = await browser.newPage()
    await page.goto(vite.url, {waitUntil: 'domcontentloaded'})
    await page.waitForSelector('body>div>*')
  })
  afterEach(async () => {
    await page?.close()
  })
  test('static HTML after React render', async () => {
    const html = await page.content()
    await Bun.write('out/test/render.html', html)
    expect(html).toContain('<input')
    expect(html).toContain('camelCase')
    expect(html).toContain('PascalCase')
    expect(html).toContain('snake_case')
    expect(html).toContain('CONSTANT_CASE')
    expect(html).toContain('kebab-case')
    expect(html).toContain('Train-Case')
    expect(html).toContain('COBOL-CASE')
    expect(html).toContain('lower case')
    expect(html).toContain('UPPER CASE')
    expect(html).toContain('Title Case')
    expect(html).toContain('Sentence case')
  })
  test('page title is set', async () => {
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
  })
  test('input field accepts text and updates results', async () => {
    const inputSelector = 'input[type="text"]'
    await page.waitForSelector(inputSelector)
    // Focus and select all existing text, then type
    await page.focus(inputSelector)
    await page.evaluate(sel => {
      (document.querySelector(sel) as HTMLInputElement).select()
    }, inputSelector)
    await page.type(inputSelector, 'hello world')
    // Wait a moment for React to update
    await page.waitForFunction(() => {
      const outputs = document.querySelectorAll('output')
      return outputs.length > 0 && outputs[0].textContent !== ''
    })
    // Verify the casings are generated
    const pageText = await page.evaluate(() => document.body.innerText)
    expect(pageText).toContain('helloWorld')
    expect(pageText).toContain('HelloWorld')
    expect(pageText).toContain('hello_world')
    expect(pageText).toContain('HELLO_WORLD')
    expect(pageText).toContain('hello-world')
    expect(pageText).toContain('Hello-World')
    expect(pageText).toContain('HELLO-WORLD')
    expect(pageText).toContain('hello world')
    expect(pageText).toContain('HELLO WORLD')
    expect(pageText).toContain('Hello World')
    expect(pageText).toContain('Hello world')
  })
  test('casings update live as user types', async () => {
    const inputSelector = 'input[type="text"]'
    await page.waitForSelector(inputSelector)
    // Focus and select all existing text, then type
    await page.focus(inputSelector)
    await page.evaluate(sel => {
      (document.querySelector(sel) as HTMLInputElement).select()
    }, inputSelector)
    await page.type(inputSelector, 'foo')
    await page.waitForFunction(() => {
      const outputs = document.querySelectorAll('output')
      return outputs.length > 0 && outputs[0].textContent === 'foo'
    })
    let pageText = await page.evaluate(() => document.body.innerText)
    expect(pageText).toContain('foo') // camelCase single word
    // Type more
    await page.type(inputSelector, ' bar')
    await page.waitForFunction(() => {
      const outputs = document.querySelectorAll('output')
      return outputs.length > 0 && outputs[0].textContent === 'fooBar'
    })
    pageText = await page.evaluate(() => document.body.innerText)
    expect(pageText).toContain('fooBar')
    expect(pageText).toContain('FooBar')
    expect(pageText).toContain('foo_bar')
  })
  test('11 casing items rendered', async () => {
    const count = await page.evaluate(() => document.querySelectorAll('li').length)
    expect(count).toBe(11)
  })
  if (host === 'chrome') {
    describe.each(['page', 'content'])('%s screenshot', scope => {
      test.each(['dark', 'light'])('%s', async theme => {
        const image = await screenshot(page, {
          colorScheme: theme,
          element: scope === 'content' ? 'body>*>main' : undefined,
        })
        await Bun.write(`out/test/screenshots/${host}_${theme}_${scope}.png`, image)
        const pixels = countPixels(image)
        if (scope === 'page') {
          const target = theme === 'dark' ? '000000FF' : 'FFFFFFFF'
          const hits = countPixels(image, target)
          expect(hits).toBeWithin(0.5 * pixels, 0.999 * pixels)
        } else {
          expect(pixels).toBeGreaterThan(100)
        }
      })
    })
  }
})
