# Casings

A web app that live-converts entered text into 11 different case formats:

- **camelCase** – `helloWorld`
- **PascalCase** – `HelloWorld`
- **snake_case** – `hello_world`
- **CONSTANT_CASE** – `HELLO_WORLD`
- **kebab-case** – `hello-world`
- **Train-Case** – `Hello-World`
- **COBOL-CASE** – `HELLO-WORLD`
- **lower case** – `hello world`
- **UPPER CASE** – `HELLO WORLD`
- **Title Case** – `Hello World`
- **Sentence case** – `Hello world`

The word-splitting algorithm handles input in any format – spaces, hyphens, underscores, camelCase and PascalCase boundaries are all detected automatically.

## Development

```bash
bun install
bun run vite      # dev server
bun run lint      # type-check + knip
bun test          # unit + component tests
bun run test-live # production build + browser tests
```
