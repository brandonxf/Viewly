/*
 * Viewly sync.js — pégalo en tu proyecto: <script src="http://localhost:5173/sync.js"></script>
 * Envía al visor (window.parent) la posición de scroll como proporción (0–1) y la ruta actual,
 * aplica el scroll y la navegación que el visor reenvía desde otro frame.
 */
(function () {
  if (window.parent === window) return // no está dentro del visor
  var applying = false

  // Oculta la barra de scroll sin cambiar el ancho del viewport (las media queries siguen midiendo el ancho real).
  var st = document.createElement('style')
  st.textContent = 'html{scrollbar-width:none}html::-webkit-scrollbar{display:none}'
  ;(document.head || document.documentElement).appendChild(st)
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

  // --- Navegación: avisar al visor cuando cambia la ruta (carga, pushState, popstate, hash) ---
  var lastPath = null
  function currentPath() {
    return location.pathname + location.search + location.hash
  }
  function sendRoute() {
    var p = currentPath()
    if (p === lastPath) return
    lastPath = p
    window.parent.postMessage({ type: 'viewly:route', path: p }, '*')
  }
  ;['pushState', 'replaceState'].forEach(function (fn) {
    var orig = history[fn]
    history[fn] = function () {
      var r = orig.apply(this, arguments)
      sendRoute()
      return r
    }
  })
  window.addEventListener('popstate', sendRoute)
  window.addEventListener('hashchange', sendRoute)
  lastPath = currentPath() // la ruta inicial no se envía: todos los frames parten de la misma URL

  window.addEventListener('message', function (e) {
    var m = e.data
    if (m && m.type === 'viewly:navigate' && typeof m.path === 'string') {
      // Solo rutas del mismo origen (empiezan por "/"); si ya estamos ahí no se hace nada (anti-eco).
      if (m.path.charAt(0) === '/' && m.path.charAt(1) !== '/' && m.path !== currentPath()) {
        lastPath = m.path
        location.assign(m.path)
      }
      return
    }
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
