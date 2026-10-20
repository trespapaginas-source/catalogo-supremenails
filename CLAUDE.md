# Reglas del proyecto — Catálogo Supreme Nails

## Regla de estándar de diseño (siempre activa)

Cuando el usuario dé una orden de diseño/UX/UI, **no implementar la solución más rápida o genérica**. Se debe entregar la versión más pulida y profesional que sea razonable dentro del alcance pedido, no un mínimo viable.

**Cómo aplicar esto en la práctica:**

1. **Antes de programar**, si la orden admite más de un enfoque de diseño razonable, describir brevemente 2-3 alternativas (con su trade-off) y dejar que el usuario elija, en vez de asumir la más simple. Solo saltarse este paso si la orden ya es muy específica o el caso es trivial.
2. **Cuidar los detalles que separan "funcional" de "profesional":** transiciones/animaciones suaves en cambios de estado, feedback visual en interacciones (hover, active, focus, tap), coherencia con el estilo visual ya establecido en el catálogo (colores, tipografía, radios de borde, espaciados), y evitar controles genéricos tipo "dos botones cuadrados" cuando existe un patrón más elegante (ej. segmented control, switch, chip).
3. **No sacrificar legibilidad ni jerarquía visual** por hacer caber más elementos (ej. no reducir texto a tamaños ilegibles solo para que quepan 3 columnas) — si hay tensión entre densidad y legibilidad, señalarlo y proponer una solución (recortar contenido, ajustar layout) en vez de simplemente achicar todo.
4. **Verificar el resultado visualmente** (capturas o medición de layout) antes de dar la tarea por terminada, y mencionar explícitamente cualquier limitación o trade-off que haya quedado pendiente.
5. Si la orden es ambigua sobre el nivel de pulido esperado, preguntar o proponer explícitamente el enfoque más cuidado como opción por defecto, no como algo opcional.

Esta regla aplica a cualquier pedido de UI/UX en este proyecto (catálogo, tarjetas, controles, navegación, tipografía, etc.), no solo a los mencionados arriba.

## Otras referencias del proyecto

- [BITACORA.md](BITACORA.md) — contexto completo del proyecto: fuente de datos oficial (Google Sheet "BASE PRODUCTOS SUPREME NAILS"), fotos en R2, plan acordado, decisiones abiertas y estado de Cloudflare/GitHub. **Leer primero al retomar el trabajo en otro computador.**
- [NOTAS_CORRECCIONES.md](NOTAS_CORRECCIONES.md) — registro de errores técnicos ya corregidos (CSS Grid, caché de imágenes, texto quemado en imágenes, etc.) y reglas generales para no repetirlos. Consultar antes de tocar layout/CSS existente.
