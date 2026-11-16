/**
 * Captura un elemento de la página usando la captura de la pestaña actual (getDisplayMedia).
 * El contenido de un iframe de otro origen no se puede leer desde JS, por eso se graba la pestaña
 * y se recorta la zona del frame. Lanza un error si el navegador no lo permite.
 */
export async function captureElement(el: HTMLElement, filename: string): Promise<void> {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new Error('unsupported')
  }
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    // @ts-expect-error opciones no tipificadas (Chrome)
    preferCurrentTab: true,
    selfBrowserSurface: 'include',
  })
  try {
    const video = document.createElement('video')
    video.srcObject = stream
    video.muted = true
    await video.play()
    await new Promise((r) => requestAnimationFrame(() => r(null)))

    // Relación entre píxeles del vídeo y píxeles CSS de la página.
    const kx = video.videoWidth / window.innerWidth
    const ky = video.videoHeight / window.innerHeight
    const r = el.getBoundingClientRect()
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(r.width * kx))
    canvas.height = Math.max(1, Math.round(r.height * ky))
    canvas.getContext('2d')!.drawImage(video, r.left * kx, r.top * ky, r.width * kx, r.height * ky, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'))
    if (!blob) throw new Error('empty')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
  } finally {
    stream.getTracks().forEach((t) => t.stop())
  }
}
