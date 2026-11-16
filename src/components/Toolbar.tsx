import { useState } from 'react'
import HelpPanel from './HelpPanel'

export type Zoom = 'fit' | number

export const ZOOM_OPTIONS: { value: Zoom; label: string }[] = [
  { value: 'fit', label: 'Ajustar' },
  { value: 0.25, label: '25%' },
  { value: 0.5, label: '50%' },
  { value: 0.75, label: '75%' },
  { value: 1, label: '100%' },
]

interface Props {
  url: string
  onSubmitUrl: (raw: string) => void
  onReload: () => void
  zoom: Zoom
  onZoom: (z: Zoom) => void
}

export default function Toolbar({ url, onSubmitUrl, onReload, zoom, onZoom }: Props) {
  const [draft, setDraft] = useState(url)

  return (
    <header className="toolbar">
      <form
        className="url-form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmitUrl(draft)
        }}
      >
        <label htmlFor="url">URL</label>
        <input
          id="url"
          value={draft}
          placeholder="localhost:5173 o 5173"
          spellCheck={false}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className="primary">Abrir</button>
      </form>
      <button type="button" onClick={onReload} disabled={!url} title="Atajo: R">Recargar</button>
      <label className="zoom">
        Zoom
        <select title="Atajo F: Ajustar"
          value={String(zoom)}
          onChange={(e) => onZoom(e.target.value === 'fit' ? 'fit' : Number(e.target.value))}
        >
          {ZOOM_OPTIONS.map((o) => (
            <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
          ))}
        </select>
      </label>
      <HelpPanel />
    </header>
  )
}
