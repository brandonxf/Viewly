export type DeviceGroup = 'phone' | 'tablet' | 'desktop' | 'custom'

export interface Device {
  id: string
  name: string
  width: number
  height: number
  group: DeviceGroup
  enabledByDefault: boolean
}

export const DEVICES: Device[] = [
  { id: 'iphone-se', name: 'iPhone SE', width: 375, height: 667, group: 'phone', enabledByDefault: false },
  { id: 'iphone-14', name: 'iPhone 14', width: 390, height: 844, group: 'phone', enabledByDefault: true },
  { id: 'pixel-7', name: 'Pixel 7', width: 412, height: 915, group: 'phone', enabledByDefault: false },
  { id: 'ipad', name: 'iPad', width: 768, height: 1024, group: 'tablet', enabledByDefault: true },
  { id: 'laptop', name: 'Laptop', width: 1280, height: 800, group: 'desktop', enabledByDefault: true },
  { id: 'desktop', name: 'Desktop', width: 1920, height: 1080, group: 'desktop', enabledByDefault: false },
]

export const GROUP_LABELS: Record<DeviceGroup, string> = {
  phone: 'Teléfonos',
  tablet: 'Tablets',
  desktop: 'Escritorio',
  custom: 'Personalizados',
}
