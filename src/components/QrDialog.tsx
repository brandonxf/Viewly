import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

interface Props {
  url: string
  onClose: () => void
}

const isLocal = (u: string) => /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])/i.test(u)

export default function QrDialog({ url, onClose }: Props) {
  const [value, setValue] = useState(url)
  const [img, setImg] = useState('')

  useEffect(() => {
    if (!value) return setImg('')
    QRCode.toDataURL(value, { margin: 1, width: 240 }).then(setImg, () => setImg(''))
  }, [value])

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" role="dialog" onClick={(e) => e.stopPropagation()}>
        <h2>Abrir en un teléfono real</h2>
        <input value={value} onChange={(e) => setValue(e.target.value)} spellCheck={false} />
        {isLocal(value) && (
          <p className="warn">
            «localhost» en el teléfono apunta al propio teléfono. Cambia el host por la IP de tu PC en la red
            (por ejemplo <code>http://192.168.1.20:5173</code>) y arranca tu servidor con acceso de red
            (en Vite, <code>--host</code>).
          </p>
        )}
        {img && <img src={img} alt="Código QR" width={240} height={240} />}
        <button type="button" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  )
}
