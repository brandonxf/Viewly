import { useRef, useState } from 'react'
import type { Device } from '../devices'
import { captureElement } from '../lib/capture'

interface Props {
  device: Device
  url: string
  scale: number
  rotated: boolean
  reloadKey: number
  onRotate?: () => void
  /** Registra el iframe para poder identificarlo en mensajes (sincronización). */
  registerFrame?: (id: string, el: HTMLIFrameElement | null) => void
  /** Si se pasa, muestra un slider de ancho (280–1920). */
  slider?: { value: number; onChange: (w: number) => void }
}

export default function DeviceFrame({ device, url, scale, rotated, reloadKey, onRotate, slider, registerFrame }: Props) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [hint, setHint] = useState(false)
  const w = rotated ? device.height : device.width
  const h = rotated ? device.width : device.height

  return (
    <figure className="frame">
      <figcaption>
        <span>{device.name} · {w}×{h}</span>
        <button
          type="button"
          title="Captura de pantalla"
          onClick={() => {
            if (!boxRef.current) return
            captureElement(boxRef.current, `viewly-${device.id}-${w}x${h}.png`).catch(() => setHint(true))
          }}
        >
          📷
        </button>
        {onRotate && <button type="button" onClick={onRotate} title="Rotar">⟳</button>}
      </figcaption>
      {slider && (
        <input
          type="range"
          className="width-slider"
          min={280}
          max={1920}
          step={1}
          value={slider.value}
          aria-label="Ancho del frame"
          onChange={(e) => slider.onChange(Number(e.target.value))}
        />
      )}
      {/* El contenedor mide ancho*s × alto*s para no dejar huecos en el layout */}
      <div ref={boxRef} className="frame-box" style={{ width: w * scale, height: h * scale }}>
        <iframe
          key={`${url}|${reloadKey}`}
          ref={(el) => registerFrame?.(device.id, el)}
          src={url}
          title={device.name}
          style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        />
      </div>
      {hint && (
        <p className="capture-hint">
          No se pudo capturar. El navegador no permite leer un iframe de otro origen; la captura usa
          «compartir esta pestaña» y puede estar cancelada o no soportada. Alternativas: la captura del SO,
          o en las DevTools de la propia página, clic derecho en el elemento → «Capture node screenshot».{' '}
          <button type="button" onClick={() => setHint(false)}>Cerrar</button>
        </p>
      )}
    </figure>
  )
}
