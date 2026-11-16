/** Completa lo que el usuario escribe a una URL válida. Devuelve '' si no hay nada. */
export function normalizeUrl(raw: string): string {
  const v = raw.trim()
  if (!v) return ''
  if (/^\d{2,5}$/.test(v)) return `http://localhost:${v}`
  if (/^https?:\/\//i.test(v)) return v
  if (/^(localhost|127\.0\.0\.1|\[::1\]|\d{1,3}(\.\d{1,3}){3})(:\d+)?(\/|$)/i.test(v)) {
    return `http://${v}`
  }
  return `https://${v}`
}
