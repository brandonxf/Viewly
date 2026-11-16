import { useState } from 'react'

export default function HelpPanel() {
  const [open, setOpen] = useState(false)
  return (
    <div className="help">
      <button type="button" onClick={() => setOpen((o) => !o)}>¿No carga?</button>
      {open && (
        <div className="help-pop" role="dialog">
          <p>No se puede detectar de forma fiable si un iframe fue bloqueado. Causas comunes:</p>
          <ul>
            <li>El servidor de desarrollo no está corriendo.</li>
            <li>El sitio envía <code>X-Frame-Options</code> o CSP <code>frame-ancestors</code>.</li>
            <li>Contenido mixto: una página HTTPS mostrando <code>http://localhost</code> (más probable en Safari).</li>
          </ul>
        </div>
      )}
    </div>
  )
}
