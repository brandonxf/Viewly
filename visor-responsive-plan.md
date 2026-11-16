# Visor responsive en vivo: plan para Claude Code

Nombre de trabajo: **Viewly** (se puede cambiar).

## Qué es

Una página web estática donde la persona que está programando pega la URL de su proyecto (normalmente `http://localhost:5173`) y la ve en varios dispositivos a la vez (teléfono, tablet y PC), uno al lado del otro. Así no tiene que abrir F12 ni el modo responsive del navegador para comprobar el diseño.

Mientras programa en su editor de siempre, al guardar, el hot reload de su servidor de desarrollo actualiza todos los frames al mismo tiempo. La página no procesa ni edita código.

```
┌────────────────────────────────────────────────────────┐
│ URL: [ http://localhost:5173 ]  [Recargar]  [Ajustar]  │
├──────────────────────────────────┬──────────┬──────────┤
│          PC (1280×800)           │ Tablet   │ 📱 375   │
│       el proyecto en vivo        │ 768×1024 │ el mismo │
└──────────────────────────────────┴──────────┴──────────┘
```

## Decisiones ya tomadas (no cambiarlas sin preguntar)

- **Modo directo:** cada dispositivo es un `<iframe>` que apunta directo a la URL. Sin proxy y sin backend.
- **Página estática**, desplegable en Vercel o GitHub Pages.
- **Stack:** Vite + React + TypeScript. CSS propio y simple, sin librerías de UI.
- **Idioma de la interfaz:** español. La internacionalización queda para después.
- **Fuera de alcance por ahora:** modo proxy, User-Agent por dispositivo, emulación de toques, cuentas de usuario y base de datos.
- **Referencia de inspiración:** https://github.com/MaxRo89/DevTool (MIT, hecho con Flask y proxy). Sirve para ideas de funciones como el catálogo de dispositivos, el zoom con modo "ajustar" y el scroll sincronizado. No copiar su código.

## Cómo funciona (idea técnica)

- Cada dispositivo es un iframe con el ancho y alto reales de ese dispositivo. Las media queries del proyecto responden al ancho del iframe, no al de la ventana.
- Para que todos quepan en pantalla, cada iframe va dentro de un contenedor con `transform: scale(s)` y `transform-origin: top left`. El contenedor exterior debe medir `ancho*s × alto*s` para que no queden huecos en el layout.
- **No recargar los iframes** cuando cambian el zoom, el tamaño de la ventana o la lista de dispositivos. Solo se recargan cuando cambia la URL o se pulsa "Recargar". El hot reload lo hace el servidor de desarrollo por su cuenta.
- "Recargar" debe forzar el remontaje del iframe (por ejemplo cambiando su `key`), porque `contentWindow.location.reload()` falla con orígenes distintos.
- El contenido de un iframe de otro origen no se puede leer ni controlar desde la página. Cualquier función que lo necesite (como sincronizar el scroll) va por `postMessage` con un script opcional (ver Fase 3).

## Fase 1: MVP (empezar aquí)

1. Proyecto Vite + React + TypeScript con estructura limpia (`src/components`, `src/devices.ts`, `src/hooks`).
2. **Barra superior:** campo de URL, botón Recargar y selector de zoom (Ajustar automático, 25%, 50%, 75%, 100%).
3. **Normalizar la URL:** si el usuario escribe `localhost:5173` o `5173`, completar a `http://localhost:5173`. Aceptar también `?url=` en la dirección de la página y guardar la última URL en `localStorage`.
4. **Catálogo de dispositivos** en `src/devices.ts`, con `id`, `name`, `width`, `height`, `group` (`phone` | `tablet` | `desktop`) y `enabledByDefault`. Valores iniciales aproximados:
   - iPhone SE: 375×667
   - iPhone 14: 390×844
   - Pixel 7: 412×915
   - iPad: 768×1024
   - Laptop: 1280×800
   - Desktop: 1920×1080
   - Por defecto activos: iPhone 14, iPad y Laptop.
5. **Panel de dispositivos:** activar o desactivar cada uno con casillas.
6. **Cada frame** muestra un título con el nombre y las medidas (`iPhone 14 · 390×844`) y un botón para **rotar** (intercambia ancho y alto).
7. **Modo "Ajustar":** calcular el factor de escala para que todos los frames activos quepan en el área disponible. Recalcular con `ResizeObserver` al cambiar el tamaño de la ventana.
8. **Ayuda "¿No carga?":** no se puede detectar de forma fiable si un iframe está bloqueado, así que mostrar un panel de ayuda con las causas comunes:
   - el servidor de desarrollo no está corriendo;
   - el sitio envía `X-Frame-Options` o CSP `frame-ancestors`;
   - bloqueo de contenido mixto (página HTTPS mostrando `http://localhost`), más probable en Safari.
9. Interfaz con tema oscuro, limpia y sin dependencias de UI.

## Fase 2: pulido

- Tamaño personalizado: un frame extra con slider de ancho (de 280 a 1920 px) para encontrar en qué punto se rompe el diseño, mostrando el ancho actual.
- Agregar y quitar dispositivos personalizados (nombre, ancho, alto), guardados en `localStorage`.
- Captura de pantalla de cada frame cuando sea posible, o instrucciones claras si el navegador no lo permite por ser otro origen.
- Atajos de teclado: `R` recargar, `F` ajustar.

## Fase 3: sincronización con script opcional

- Crear `public/sync.js` (unas 30 líneas) que el usuario pega en su proyecto con una etiqueta `<script>`. Envía por `postMessage` la posición de scroll como proporción (0 a 1 en x e y) y la ruta actual.
- La página escucha los mensajes, identifica el frame emisor con `event.source` y reenvía el mensaje a los demás frames. Evitar bucles de eco con una bandera mientras se aplica un scroll recibido.
- Interruptor "Sincronizar scroll" en la barra. Debe funcionar bien sin el script (simplemente no sincroniza).
- Más adelante, sincronizar también la navegación (cambio de ruta).

## Fase 4: extras

- Detectar puertos comunes del servidor de desarrollo (5173, 3000, 4200, 8080) y sugerirlos.
- Código QR con la dirección para abrir el proyecto en un teléfono real de la misma red.
- Instrucciones en el README para desplegar en Vercel o GitHub Pages (revisar la opción `base` de Vite).

## Cómo probarlo

- Crear `examples/demo/index.html` con una página de prueba que use media queries y muestre en grande el ancho actual (por ejemplo, con un texto que cambie en 600 px y 1024 px). Servirla con `npx serve examples/demo`.
- Criterios de aceptación del MVP:
  - Pegar la URL de la demo y ver los tres dispositivos con layouts distintos.
  - Editar el HTML de la demo y ver el cambio en todos los frames sin tocar la página del visor.
  - Cambiar el zoom, rotar un dispositivo o activar y desactivar uno sin que se recarguen los demás.
  - Recargar la página del visor mantiene la última URL y los dispositivos elegidos.
  - `npm run build` termina sin errores ni advertencias de TypeScript.

## Cómo quiero que trabajes

1. Lee este archivo completo y empieza por la **Fase 1**. No avances a las siguientes sin que yo lo pida.
2. Antes de escribir código, dime en pocas líneas la estructura de carpetas que vas a crear.
3. Haz commits pequeños con mensajes claros (uno por función).
4. Si algo es ambiguo o choca con las decisiones de arriba, pregunta antes de decidir.
5. Al terminar la Fase 1, escribe un `README.md` con: qué es, cómo correrlo (`npm install` y `npm run dev`), cómo usarlo con un proyecto local y las limitaciones conocidas.

## Limitaciones conocidas (explicarlas en el README)

- Un iframe aplica el layout responsive, pero no cambia el User-Agent ni emula toques. Tampoco reproduce el comportamiento de `100vh` de un navegador móvil real.
- Los sitios que prohíben ser embebidos no se verán en este modo.
- Chrome y Firefox suelen permitir que una página HTTPS muestre `http://localhost`. Safari puede bloquearlo. Mientras se desarrolla, correr el visor en `http://localhost` evita el problema.
