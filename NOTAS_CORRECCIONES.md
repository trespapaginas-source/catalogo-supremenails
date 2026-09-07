# Registro de correcciones — Catálogo Supreme Nails

Documento de control para no repetir errores ya corregidos. Cada entrada indica el problema, la causa técnica y la solución aplicada.

---

## 1. Texto quemado en la imagen del sidebar (resuelto, luego sidebar eliminado)
- **Síntoma:** "UÑAS QUE HABLAN DE TI" y "CALIDAD BELLEZA CONFIANZA EN CADA DETALLE" seguían viéndose tras borrar los `<p>` del HTML.
- **Causa:** el texto no era HTML, estaba dibujado directamente en el PNG de fondo (`sidebar.png`).
- **Solución:** edición de píxeles (inpainting con filtro de mediana) para borrar el texto de la imagen sin dañar el resto del diseño.
- **Lección:** antes de "eliminar" texto visible, verificar si es HTML o si está incrustado en una imagen.

## 2. Caché del navegador mostraba versiones viejas de imágenes
- **Síntoma:** el usuario seguía viendo texto/imagen vieja después de que el archivo ya estaba corregido en disco.
- **Causa:** el navegador cachea imágenes por nombre de archivo.
- **Solución:** renombrar el archivo (`sidebar.png` → `sidebar_v2.png`) para forzar la descarga de la versión nueva.
- **Lección:** si un cambio visual no se refleja pese a estar bien en el código/archivo, sospechar caché antes que del código. Recomendar recarga forzada (Ctrl+Shift+R).

## 3. Imagen cuadrada 1:1 que "creció sin control" (loop de retroalimentación CSS)
- **Síntoma:** al intentar que la imagen del producto fuera cuadrada y su lado igualara la altura del bloque de texto (nombre+desc+precio) usando `aspect-ratio:1/1` + `height:100%` + `grid-template-columns:auto 1fr`, la imagen creció desproporcionadamente y se desbordó sobre las tarjetas vecinas.
- **Causa:** circularidad en CSS Grid — la columna `auto` se dimensiona por el contenido (imagen intrínseca grande), lo que infla la fila, lo que a su vez agranda la imagen (loop), y además `auto` no se limita al ancho fijo del contenedor padre.
- **Solución:** reemplazar el enfoque 100% CSS por JavaScript (`sizePhotos()`): mide la altura real del bloque de texto y fija el tamaño de la imagen en píxeles vía `style.width/height`, con un techo (`maxPhoto`) para que nunca invada el ancho mínimo reservado al texto.
- **Lección:** "que la imagen cuadrada iguale la altura de un hermano de contenido variable" no es fiable solo con CSS Grid/aspect-ratio; medir con JS y fijar en px es más robusto.

## 4. Precio con espacio enorme debajo de la descripción
- **Síntoma:** en la tarjeta principal "Miracle" y luego en Esmaltes/Herramientas, el precio quedaba muy separado de la descripción.
- **Causa:** `margin-top:auto` en `.price` combinado con que el contenedor `.info`/`.miracle-info` se estiraba (`align-items:stretch`) para igualar la altura de:
  - un hermano más alto en el mismo grid-row (ej. el muro de colores `.swatch-wall`), o
  - la tarjeta más alta de la misma fila en una grid con `grid-template-rows:repeat(2,1fr)` (una tarjeta con título de 2-3 líneas estira a todas las demás de su fila).
- **Solución:**
  - Añadir `align-items:start` en el contenedor grid padre (`.overview-main`, `.grid.six`, `.tool-grid`) para que cada tarjeta tome su altura natural, no la del hermano más alto.
  - Cambiar `grid-template-rows:repeat(2,1fr)` → `repeat(2,auto)` para que las filas no repartan espacio sobrante innecesario.
  - Dar un `margin-bottom` fijo (14px) a la descripción en vez de depender solo de `margin-top:auto` en el precio.
- **Lección:** con `margin-top:auto` para "pegar el precio abajo", vigilar que el contenedor no se esté estirando por herencia de grid (stretch de fila o de grid-row compartido). Revisar además grids padres, no solo el componente aislado.

## 5. Franja lateral (sidebar) no se veía como en el navegador probado
- **Síntoma:** capturas del celular del usuario mostraban la franja lateral como columna angosta ocupando toda la altura, en vez de convertirse en franja superior corta (comportamiento esperado en el media query mobile `max-width:760px`).
- **Causa probable:** el dispositivo/navegador del usuario no estaba aplicando el media query esperado (posible vista de escritorio forzada, o el `.sheet` con `aspect-ratio:11/8.5` fijo se ve muy alto y angosto en pantallas móviles reales).
- **Solución aplicada:** se redujo la franja al 50% en ambos layouts (base y mobile) como pedido puntual; posteriormente la franja fue eliminada por completo.
- **Pendiente/lección:** si se reintroduce un sidebar, probar en un dispositivo móvil real (no solo con `resize_window` del navegador de control) antes de dar por bueno el comportamiento responsive.

## 6. Tarjetas de Herramientas con tamaño distinto a Esmaltes
- **Síntoma:** al pedir "+30% en imágenes de Herramientas", las tarjetas de Herramientas quedaron con proporciones distintas a las de Esmaltes (padding 14px vs 16px, gap 14px vs 16px, y un `scale`/`minInfoW` distinto en el JS de sizePhotos), rompiendo la consistencia visual entre pestañas.
- **Causa:** cambios aplicados solo a `.tool-card`/`.tool-grid` sin replicar en `.card`/`.grid.six`, y una rama condicional `isTool` en `sizePhotos()` que aplicaba una escala y un ratio de ancho mínimo distintos.
- **Solución:** unificar padding/gap entre `.card` y `.tool-card` (16px ambos), unificar `grid-template-rows` (auto en ambos), y eliminar la rama `isTool` del JS para que todas las tarjetas usen la misma fórmula de tamaño.
- **Lección:** **cualquier ajuste de tamaño/espaciado que se pida "solo para una pestaña" debe registrarse aquí de inmediato**, y antes de darlo por definitivo preguntar o recordar si debe replicarse en las demás pestañas para mantener consistencia global. Preferir variables/reglas compartidas (una sola clase o un mismo bloque de CSS) en vez de duplicar reglas por pestaña cuando el diseño debe ser idéntico.

## 7. Assets compartidos por el usuario no llegan siempre al directorio de trabajo
- **Síntoma:** imágenes que el usuario dice haber "compartido a la carpeta del proyecto" a veces aparecen en otra ruta (ej. `~/Descargas/supreme_catalogo/assets/` en vez de `/mnt/.../supreme_catalogo/assets/`).
- **Solución:** usar `find / -iname "<nombre>*"` para localizar el archivo real antes de asumir que no fue compartido, y copiarlo al proyecto activo.
- **Lección:** no asumir que un archivo "no llegó" — buscar en todo el sistema por nombre antes de pedirle al usuario que lo reenvíe.

## 8. `hidden` (atributo HTML) no ocultaba el botón "Cotizar por WhatsApp"
- **Síntoma:** al implementar favoritos, el botón seguía visible aunque `quoteBtn.hidden = true` se ejecutaba correctamente (verificado con `items.length===0`).
- **Causa:** el atributo `hidden` depende de la regla `[hidden]{display:none}` del user-agent stylesheet, con especificidad (0,1,0). Como `.whatsapp-btn{display:inline-flex;...}` definida en el CSS del proyecto tiene la misma especificidad (0,1,0) pero aparece **después** en el orden de cascada, esa regla ganaba y pisaba el `display:none` nativo.
- **Solución:** agregar explícitamente `.whatsapp-btn[hidden]{display:none}` (especificidad 0,2,0, gana siempre) junto a cualquier clase que fije `display` en un elemento que también se oculte con `.hidden`/`[hidden]` en JS.
- **Lección:** cualquier elemento que se oculte vía `el.hidden = true` y que **también** tenga una regla CSS propia con `display` explícito (flex/grid/inline-flex/block) necesita su propio `[hidden]{display:none}` — si no, el `hidden` nativo queda pisado en silencio y no da ningún error en consola.

## 9. Botón de buscar descuadrado frente al selector de columnas
- **Síntoma:** el ícono de lupa se veía "fuera de tono", flotando aparte del grupo de botones de 1/2/3 columnas, y seguía desalineado incluso al abrirse el campo de texto.
- **Causa doble:** (a) `.view-toggle` tenía su propio fondo/borde/padding tipo píldora, mientras que `.search-btn` era un botón suelto sin ese tratamiento — visualmente parecían dos controles de familias distintas; (b) el contenedor `.search-wrap` no tenía ninguna regla CSS (ni `display:flex`), así que el botón de lupa y el campo de búsqueda (que sí era `display:flex`, o sea de bloque) se apilaban en líneas distintas en vez de quedar uno al lado del otro.
- **Solución:** unificar buscador + selector de columnas dentro de un solo contenedor píldora (`.listing-controls` con el fondo/borde que antes tenía solo `.view-toggle`), separados por un divisor sutil, y agregar la regla `.search-wrap{display:flex;align-items:center}` que faltaba.
- **Lección:** cuando se agregue un control nuevo junto a uno ya existente (botones, toggles, iconos), no darle un tratamiento visual aislado — o se integra dentro del mismo contenedor/píldora del control existente, o se le da exactamente el mismo fondo/padding/altura. Y todo contenedor flex debe declarar explícitamente `display:flex` — un `<div>` sin esa regla es bloque por defecto y rompe el alineamiento de sus hijos sin ningún error visible en consola.

## 10. Imagen del pop-up de producto se veía pequeña
- **Síntoma:** al abrir la ficha de producto, la foto aparecía chica dentro de un área ancha, con mucho espacio vacío a los lados.
- **Causa:** `.modal-photo` combinaba `aspect-ratio:1/1` con `max-height:320px` sobre un contenedor de hasta 560px de ancho. El navegador estiraba el ancho a 560px pero limitaba el alto a 320px, dando un rectángulo 560×320 (no cuadrado). La imagen, limitada a 78% del lado *más chico* (320px), terminaba en ~250px dentro de una caja mucho más ancha.
- **Solución:** quitar el `max-height` que rompía la proporción cuadrada, dejar que `aspect-ratio:1/1` defina un cuadrado real con `width:100%`, y reducir el ancho máximo del modal (560px → 440px) para que ese cuadrado tenga un tamaño razonable en vez de ser gigante. Se subió también el porcentaje de la imagen dentro del cuadro (78% → 88%).
- **Lección:** `aspect-ratio:1/1` y un `max-height` fijo **no deben combinarse** en el mismo elemento si se quiere un cuadrado real — uno de los dos termina ganando y deja de ser cuadrado. Para limitar el tamaño de una caja cuadrada, limitar su **ancho** (`max-width`/`width` del contenedor padre), nunca su alto por separado.

## 11. "Favoritos" como página completa en vez de panel flotante
- **Síntoma:** el usuario pidió una lista de favoritos tipo "dropdown" que aparezca sobre la vista actual; la primera versión navegaba a una página nueva completa (con su propio header/hero), perdiendo de vista la categoría que se estaba explorando y sin una forma rápida de "volver".
- **Causa:** se implementó favoritos como una sección `.sheet[data-page="fav"]` más, reutilizando el mismo patrón de navegación de categorías — funcionalmente correcto pero no es lo que se pidió (un panel superpuesto, no una página).
- **Solución:** se reconstruyó como un panel (`fav-drawer`) de posición fija anclado bajo el ícono de corazón, con fondo oscurecido (`fav-drawer-backdrop`) detrás. Cerrar con la X, con clic en el fondo oscurecido, o con Esc — en los tres casos simplemente se ocultan clases, sin tocar `showPage()`, así que la categoría que se estaba viendo permanece exactamente igual detrás.
- **Lección:** cuando el usuario pida ver una "lista" de algo (favoritos, carrito, notificaciones) sin mencionar explícitamente una página dedicada, la opción más pulida y menos disruptiva por defecto es un **panel/dropdown superpuesto que preserva el estado de la pantalla actual**, no una navegación de página completa — reservar la navegación de página completa para secciones que el usuario recorre con intención de quedarse (como las categorías del catálogo).

---

## Reglas generales a respetar de aquí en adelante
1. **Consistencia entre pestañas**: cualquier cambio de tamaño, espaciado, padding o gap en tarjetas/imágenes de una pestaña (Esmaltes/Colecciones/Herramientas) debe evaluarse para las otras dos, salvo que el usuario diga explícitamente que es exclusivo de una.
2. **Medir antes de fijar tamaños "iguales a"**: cuando se pida que un elemento mida "lo mismo que" otro con contenido variable, usar JS para medir y fijar en píxeles; no confiar en trucos de CSS Grid/Flexbox con `auto`/`stretch` sin verificar visualmente el resultado.
3. **Cuidado con `align-items:stretch` (valor por defecto de Grid/Flex)**: revisar si el contenedor padre está estirando la tarjeta/columna más de lo necesario antes de usar `margin-top:auto` para anclar elementos al fondo.
4. **Verificar en navegador tras cada cambio** (desktop y, cuando aplique, mobile) antes de dar el cambio por terminado.
5. **Ante texto/elemento que "no se borra"**: comprobar si es HTML real o parte de una imagen antes de intentar editarlo como texto.
6. **Ante cambios no reflejados**: sospechar caché del navegador (renombrar archivo o forzar recarga) antes de asumir que el código está mal.
7. **Controles nuevos junto a controles existentes** (botones, toggles, iconos de acción): deben compartir el mismo contenedor visual (misma píldora/fondo/altura) que sus vecinos, o integrarse dentro del contenedor que ya existe — nunca quedar como un elemento suelto al lado de un grupo ya estilizado.
8. **Todo contenedor que dependa de `display:flex` para alinear a sus hijos debe declararlo explícitamente** en su propia regla CSS — no asumir que "ya se ve bien" sin verificar el `display` computado; un `<div>` sin esa regla es bloque por defecto y no da ningún error visible.
9. **`aspect-ratio` no se combina con un `max-height`/`max-width` fijo en el mismo elemento** si se necesita una proporción exacta (ej. cuadrado 1:1) — limitar el tamaño desde el contenedor padre (ancho), no desde una segunda restricción de tamaño en el mismo elemento.
10. **Listas superpuestas (favoritos, carrito, notificaciones) van en un panel/dropdown que preserva la pantalla actual** por defecto, no en una navegación de página completa — a menos que el usuario pida explícitamente una página dedicada.
11. **Antes de entregar cualquier cambio visual, verificar con capturas de pantalla real** (no solo revisar el código) — abrir, interactuar (clic, hover, expandir) y confirmar visualmente que coincide con lo pedido, en desktop y mobile.
