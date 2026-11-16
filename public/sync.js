/*
 * Viewly sync.js — pégalo en tu proyecto: <script src="http://localhost:5173/sync.js"></script>
 * Envía al visor (window.parent) la posición de scroll como proporción (0–1) y la ruta actual,
 * y aplica el scroll que el visor reenvía desde otro frame.
 */
(function () {
  if (window.parent === window) return // no está dentro del visor
  var applying = false
  var timer = null

  function ratio(pos, size, view) {
    var max = size - view
    return max > 0 ? pos / max : 0
  }

  function send() {
    if (applying) return
    var d = document.documentElement
    window.parent.postMessage(
      {
        type: 'viewly:scroll',
        x: ratio(window.scrollX, d.scrollWidth, window.innerWidth),
        y: ratio(window.scrollY, d.scrollHeight, window.innerHeight),
        path: location.pathname + location.search + location.hash,
      },
      '*',
    )
  }

  window.addEventListener('scroll', send, { passive: true })

  window.addEventListener('message', function (e) {
    var m = e.data
    if (!m || m.type !== 'viewly:apply-scroll') return
    var d = document.documentElement
    // Bandera anti-eco: los scroll que provoca esta aplicación no se reenvían.
    applying = true
    window.scrollTo(
      m.x * Math.max(0, d.scrollWidth - window.innerWidth),
      m.y * Math.max(0, d.scrollHeight - window.innerHeight),
    )
    clearTimeout(timer)
    timer = setTimeout(function () { applying = false }, 120)
  })
})()
