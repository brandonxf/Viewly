import { useEffect, useState } from 'react'

export const COMMON_PORTS = [5173, 3000, 4200, 8080]

/** Comprueba qué puertos comunes responden en localhost. Un rechazo de conexión = puerto cerrado. */
async function probe(port: number): Promise<boolean> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 1200)
  try {
    await fetch(`http://localhost:${port}/`, { mode: 'no-cors', signal: ctrl.signal, cache: 'no-store' })
    return true
  } catch {
    return false
  } finally {
    clearTimeout(t)
  }
}

export function useDevPorts() {
  const [open, setOpen] = useState<number[]>([])

  useEffect(() => {
    let alive = true
    const scan = async () => {
      const own = Number(window.location.port)
      const ports = COMMON_PORTS.filter((p) => p !== own)
      const res = await Promise.all(ports.map(probe))
      if (alive) setOpen(ports.filter((_, i) => res[i]))
    }
    scan()
    const id = setInterval(scan, 5000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  return open
}
