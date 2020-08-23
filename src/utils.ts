export function normalize(str: string) {
  return capitalize(camelize(str))
}

export function camelize(str: string) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
