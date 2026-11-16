import { useEffect, useState, type RefObject } from 'react'

const PADDING = 16 // padding del contenedor .frames (por lado)
const GAP = 20 // separación entre frames
const CAPTION = 28 // alto aproximado del título de cada frame

/** Calcula el factor de escala para que todos los frames (ancho/alto reales) quepan en el área. */
export function useFitScale(ref: RefObject<HTMLElement | null>, sizes: { w: number; h: number }[]) {
  const [area, setArea] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setArea({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])

  if (!sizes.length || !area.w || !area.h) return 1
  const totalW = sizes.reduce((a, s) => a + s.w, 0)
  const maxH = Math.max(...sizes.map((s) => s.h))
  const availW = area.w - PADDING * 2 - GAP * (sizes.length - 1)
  const availH = area.h - PADDING * 2 - CAPTION
  const s = Math.min(availW / totalW, availH / maxH, 1)
  return Math.max(s, 0.05)
}
