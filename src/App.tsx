import { useState } from 'react'
import Toolbar, { type Zoom } from './components/Toolbar'
import { useLocalStorage } from './hooks/useLocalStorage'
import { normalizeUrl } from './lib/url'

function initialUrl(): string {
  const q = new URLSearchParams(window.location.search).get('url')
  return q ? normalizeUrl(q) : ''
}

export default function App() {
  const [stored, setStored] = useLocalStorage<string>('rl:url', '')
  const [url, setUrlState] = useState(() => initialUrl() || stored)
  const [zoom, setZoom] = useLocalStorage<Zoom>('rl:zoom', 'fit')
  const [reloadKey, setReloadKey] = useState(0)

  const setUrl = (raw: string) => {
    const n = normalizeUrl(raw)
    setUrlState(n)
    setStored(n)
  }

  return (
    <div className="app">
      <Toolbar
        key={url}
        url={url}
        onSubmitUrl={setUrl}
        onReload={() => setReloadKey((k) => k + 1)}
        zoom={zoom}
        onZoom={setZoom}
      />
      <main className="stage" data-reload={reloadKey}>
        {!url && <p className="empty">Escribe la URL de tu proyecto para empezar.</p>}
      </main>
    </div>
  )
}
