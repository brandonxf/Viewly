import { useEffect, useRef, useState } from 'react'
import Toolbar, { type Zoom } from './components/Toolbar'
import { useLocalStorage } from './hooks/useLocalStorage'
import { normalizeUrl } from './lib/url'
import { useDevPorts } from './hooks/useDevPorts'
import { useFitScale } from './hooks/useFitScale'
import DevicePanel from './components/DevicePanel'
import DeviceFrame from './components/DeviceFrame'
import { DEVICES, type Device } from './devices'

function initialUrl(): string {
  const q = new URLSearchParams(window.location.search).get('url')
  return q ? normalizeUrl(q) : ''
}

export default function App() {
  const [stored, setStored] = useLocalStorage<string>('rl:url', '')
  const [url, setUrlState] = useState(() => initialUrl() || stored)
  const [zoom, setZoom] = useLocalStorage<Zoom>('rl:zoom', 'fit')
  const [enabled, setEnabled] = useLocalStorage<string[]>(
    'rl:devices',
    DEVICES.filter((d) => d.enabledByDefault).map((d) => d.id),
  )
  const [custom, setCustom] = useLocalStorage<Device[]>('rl:custom', [])
  const [freeOn, setFreeOn] = useLocalStorage<boolean>('rl:free', false)
  const [freeW, setFreeW] = useLocalStorage<number>('rl:freeW', 600)
  const [syncScroll, setSyncScroll] = useLocalStorage<boolean>('rl:sync', false)
  const frames = useRef(new Map<string, HTMLIFrameElement>())
  const registerFrame = (id: string, el: HTMLIFrameElement | null) => {
    if (el) frames.current.set(id, el)
    else frames.current.delete(id)
  }
  const [rotated, setRotated] = useState<string[]>([])
  const ports = useDevPorts()
  const [reloadKey, setReloadKey] = useState(0)

  const setUrl = (raw: string) => {
    const n = normalizeUrl(raw)
    setUrlState(n)
    setStored(n)
  }

  const toggle = (id: string) =>
    setEnabled((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))

  const rotate = (id: string) =>
    setRotated((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))
  const addDevice = (name: string, width: number, height: number) => {
    const id = `custom-${Date.now()}`
    setCustom((cur) => [...cur, { id, name, width, height, group: 'custom', enabledByDefault: true }])
    setEnabled((cur) => [...cur, id])
  }
  const removeDevice = (id: string) => {
    setCustom((cur) => cur.filter((d) => d.id !== id))
    setEnabled((cur) => cur.filter((x) => x !== id))
  }
  const active = [...DEVICES, ...custom].filter((d) => enabled.includes(d.id))
  const stageRef = useRef<HTMLElement>(null)
  const freeDevice: Device = {
    id: 'free',
    name: 'Ancho libre',
    width: freeW,
    height: 800,
    group: 'custom',
    enabledByDefault: false,
  }
  const sizes = active.map((d) => (rotated.includes(d.id) ? { w: d.height, h: d.width } : { w: d.width, h: d.height }))
  if (freeOn) sizes.push({ w: freeW, h: 800 })
  const fit = useFitScale(stageRef, sizes)
  const scale = zoom === 'fit' ? fit : zoom

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return
      const k = e.key.toLowerCase()
      if (k === 'r') setReloadKey((n) => n + 1)
      else if (k === 'f') setZoom('fit')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setZoom])

  useEffect(() => {
    if (!syncScroll) return
    const onMessage = (e: MessageEvent) => {
      const m = e.data
      if (!m || (m.type !== 'viewly:scroll' && m.type !== 'viewly:route')) return
      const msg =
        m.type === 'viewly:scroll'
          ? { type: 'viewly:apply-scroll', x: m.x, y: m.y }
          : { type: 'viewly:navigate', path: m.path }
      for (const el of frames.current.values()) {
        // Solo reenviar a los demás frames; el emisor se identifica con event.source.
        if (el.contentWindow && el.contentWindow !== e.source) {
          el.contentWindow.postMessage(msg, '*')
        }
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [syncScroll])

  return (
    <div className="app">
      <Toolbar
        key={url}
        url={url}
        onSubmitUrl={setUrl}
        onReload={() => setReloadKey((k) => k + 1)}
        zoom={zoom}
        onZoom={setZoom}
        syncScroll={syncScroll}
        onSyncScroll={setSyncScroll}
      />
      <div className="body">
        <DevicePanel custom={custom} enabled={enabled} onToggle={toggle} onAdd={addDevice} onRemove={removeDevice} freeOn={freeOn} onFreeToggle={() => setFreeOn((v) => !v)} />
        <main className="stage" ref={stageRef}>
          {!url && (
            <div className="empty">
              <h1>Ve tu proyecto en todos los dispositivos</h1>
              <p>Escribe la URL de tu servidor de desarrollo para empezar.</p>
              {ports.length > 0 && (
                <p>
                  Servidores detectados:{' '}
                  {ports.map((p) => (
                    <button key={p} type="button" className="chip" onClick={() => setUrl(String(p))}>
                      localhost:{p}
                    </button>
                  ))}
                </p>
              )}
            </div>
          )}
          {url && (
            <div className="frames">
              {active.map((d) => (
                <DeviceFrame
                  key={d.id}
                  device={d}
                  url={url}
                  scale={scale}
                  rotated={rotated.includes(d.id)}
                  reloadKey={reloadKey}
                  onRotate={() => rotate(d.id)}
                  registerFrame={registerFrame}
                />
              ))}
              {freeOn && (
                <DeviceFrame
                  device={freeDevice}
                  url={url}
                  scale={scale}
                  rotated={false}
                  reloadKey={reloadKey}
                  slider={{ value: freeW, onChange: setFreeW }}
                  registerFrame={registerFrame}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
