import type { Device } from '../devices'

interface Props {
  device: Device
  url: string
  scale: number
  rotated: boolean
  reloadKey: number
  onRotate?: () => void
  /** Si se pasa, muestra un slider de ancho (280–1920). */
  slider?: { value: number; onChange: (w: number) => void }
}

export default function DeviceFrame({ device, url, scale, rotated, reloadKey, onRotate, slider }: Props) {
  const w = rotated ? device.height : device.width
  const h = rotated ? device.width : device.height

  return (
    <figure className="frame">
      <figcaption>
        <span>{device.name} · {w}×{h}</span>
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
      <div className="frame-box" style={{ width: w * scale, height: h * scale }}>
        <iframe
          key={`${url}|${reloadKey}`}
          src={url}
          title={device.name}
          style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        />
      </div>
    </figure>
  )
}
