import { useState } from 'react'
import { DEVICES, GROUP_LABELS, type Device, type DeviceGroup } from '../devices'

interface Props {
  custom: Device[]
  enabled: string[]
  onToggle: (id: string) => void
  onAdd: (name: string, width: number, height: number) => void
  onRemove: (id: string) => void
}

const GROUPS: DeviceGroup[] = ['phone', 'tablet', 'desktop', 'custom']

export default function DevicePanel({ custom, enabled, onToggle, onAdd, onRemove }: Props) {
  const [name, setName] = useState('')
  const [w, setW] = useState('')
  const [h, setH] = useState('')
  const all = [...DEVICES, ...custom]

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const width = Math.round(Number(w))
    const height = Math.round(Number(h))
    if (!(width >= 200 && width <= 4000 && height >= 200 && height <= 4000)) return
    onAdd(name.trim() || `Custom ${width}×${height}`, width, height)
    setName('')
    setW('')
    setH('')
  }

  return (
    <aside className="device-panel">
      <h2>Dispositivos</h2>
      {GROUPS.map((g) => {
        const list = all.filter((d) => d.group === g)
        if (!list.length) return null
        return (
          <section key={g}>
            <h3>{GROUP_LABELS[g]}</h3>
            {list.map((d) => (
              <label key={d.id} className="check">
                <input type="checkbox" checked={enabled.includes(d.id)} onChange={() => onToggle(d.id)} />
                <span>{d.name}</span>
                <small>{d.width}×{d.height}</small>
                {d.group === 'custom' && (
                  <button type="button" className="x" title="Quitar" onClick={(e) => { e.preventDefault(); onRemove(d.id) }}>×</button>
                )}
              </label>
            ))}
          </section>
        )
      })}
      <form className="add-device" onSubmit={submit}>
        <h3>Añadir dispositivo</h3>
        <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="row">
          <input type="number" placeholder="Ancho" min={200} max={4000} value={w} onChange={(e) => setW(e.target.value)} required />
          <input type="number" placeholder="Alto" min={200} max={4000} value={h} onChange={(e) => setH(e.target.value)} required />
        </div>
        <button type="submit">Añadir</button>
      </form>
    </aside>
  )
}
