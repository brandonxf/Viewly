# Viewly

Página web estática donde pegas la URL de tu proyecto (normalmente `http://localhost:5173`) y lo ves a la vez en varios dispositivos (teléfono, tablet y PC), sin abrir F12 ni el modo responsive del navegador. Al guardar en tu editor, el hot reload de tu servidor de desarrollo actualiza todos los frames. El visor no procesa ni edita código.

Cada dispositivo es un `<iframe>` con su tamaño real, escalado con `transform: scale()`. Sin proxy ni backend.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre el visor en `http://localhost:5173` (o el puerto que indique Vite). Para compilar: `npm run build`.

## Uso con un proyecto local

1. Arranca tu proyecto con su servidor de desarrollo (por ejemplo en el puerto 3000).
2. En el visor escribe `localhost:3000` o solo `3000` y pulsa **Abrir**. También puedes usar `?url=localhost:3000`.
3. Activa o desactiva dispositivos en el panel izquierdo; rota cada uno con ⟳.
4. **Zoom**: *Ajustar* hace que todos los frames activos quepan en pantalla; también hay 25%, 50%, 75% y 100%.
5. **Recargar** remonta los iframes. Cambiar zoom, rotar o activar dispositivos no recarga los demás.

### Funciones de la Fase 2

- **Ancho libre:** activa «Frame con slider» en el panel para arrastrar el ancho (280–1920 px) y ver en qué punto se rompe el diseño.
- **Dispositivos personalizados:** añádelos con nombre, ancho y alto; se guardan en `localStorage` y se pueden quitar con ×.
- **Captura (📷):** usa «compartir esta pestaña» del navegador y recorta el frame (funciona mejor en Chrome). Si no es posible, el visor muestra alternativas.
- **Atajos:** `R` recarga, `F` ajusta el zoom (no actúan mientras escribes en un campo ni con el foco dentro de un iframe).

La última URL, el zoom y los dispositivos elegidos se guardan en `localStorage`.

Para probar: `npx serve examples/demo` y pega la URL que muestre.

> Si tu proyecto usa el puerto 5173, arranca el visor en otro: `npm run dev -- --port 4000`.

## Limitaciones conocidas

- Un iframe aplica el layout responsive, pero no cambia el User-Agent ni emula toques. Tampoco reproduce el comportamiento de `100vh` de un navegador móvil real.
- Los sitios que prohíben ser embebidos (`X-Frame-Options`, CSP `frame-ancestors`) no se verán.
- Chrome y Firefox suelen permitir que una página HTTPS muestre `http://localhost`; Safari puede bloquearlo. Mientras desarrollas, correr el visor en `http://localhost` evita el problema.
- No se puede detectar de forma fiable si un iframe fue bloqueado; por eso existe el botón **¿No carga?**.
