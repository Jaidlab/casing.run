declare module '*.module.sass' {
  const classes: Record<string, string>
  export default classes
}
declare module '*.sass' {
  const content: string
  export default content
}
