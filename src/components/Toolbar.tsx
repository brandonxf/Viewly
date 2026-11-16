import { useState } from 'react'
import QrDialog from './QrDialog'
import Icon from './Icon'
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
  syncScroll: boolean
  onSyncScroll: (v: boolean) => void
}

export default function Toolbar({ url, onSubmitUrl, onReload, zoom, onZoom, syncScroll, onSyncScroll }: Props) {
  const [draft, setDraft] = useState(url)
  const [qr, setQr] = useState(false)

  return (
    <header className="toolbar">
      <div className="brand">
        <span className="logo" aria-hidden="true" />
        Viewly
      </div>
      <form
        className="url-form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmitUrl(draft)
        }}
      >
        <Icon name="globe" />
        <input
          id="url"
          aria-label="URL del proyecto"
          value={draft}
          placeholder="localhost:5173 o 5173"
          spellCheck={false}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className="primary">Abrir</button>
      </form>
      <div className="actions">
        <button type="button" className="icon-btn" onClick={onReload} disabled={!url} title="Recargar (R)">
          <Icon name="reload" />
        </button>
        <div className="segmented" role="group" aria-label="Zoom" title="Atajo F: Ajustar">
          {ZOOM_OPTIONS.map((o) => (
            <button
              key={String(o.value)}
              type="button"
              className={o.value === zoom ? 'on' : ''}
              onClick={() => onZoom(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
        <label className="switch" title="Sincroniza scroll y navegación entre frames (requiere public/sync.js en tu proyecto)">
          <input type="checkbox" checked={syncScroll} onChange={(e) => onSyncScroll(e.target.checked)} />
          <span className="track" />
          Sync
        </label>
        <button type="button" className="icon-btn" onClick={() => setQr(true)} disabled={!url} title="Abrir en un teléfono (QR)">
          <Icon name="qr" />
        </button>
        <HelpPanel />
      </div>
      {qr && <QrDialog url={url} onClose={() => setQr(false)} />}
    </header>
  )
}
