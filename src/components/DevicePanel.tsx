import { DEVICES, GROUP_LABELS, type DeviceGroup } from '../devices'

interface Props {
  enabled: string[]
  onToggle: (id: string) => void
}

const GROUPS: DeviceGroup[] = ['phone', 'tablet', 'desktop']

export default function DevicePanel({ enabled, onToggle }: Props) {
  return (
    <aside className="device-panel">
      <h2>Dispositivos</h2>
      {GROUPS.map((g) => (
        <section key={g}>
          <h3>{GROUP_LABELS[g]}</h3>
          {DEVICES.filter((d) => d.group === g).map((d) => (
            <label key={d.id} className="check">
              <input type="checkbox" checked={enabled.includes(d.id)} onChange={() => onToggle(d.id)} />
              <span>{d.name}</span>
              <small>{d.width}×{d.height}</small>
            </label>
          ))}
        </section>
      ))}
    </aside>
  )
}
