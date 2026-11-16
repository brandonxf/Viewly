import { useState } from 'react'
import Icon from './Icon'

export default function HelpPanel() {
  const [open, setOpen] = useState(false)
  return (
    <div className="help">
      <button type="button" className="icon-btn" onClick={() => setOpen((o) => !o)} title="¿No carga?">
        <Icon name="help" />
      </button>
      {open && (
        <div className="help-pop" role="dialog">
          <h3>¿No carga?</h3>
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
