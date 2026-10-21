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

## 12. El CSV «gviz» de Google Sheets pierde encabezados y celdas (resuelto)
- **Síntoma:** al leer la Base con `.../gviz/tq?tqx=out:csv&sheet=...`, los encabezados «Precio de venta 1/2» llegaban vacíos y el catálogo no encontraba la columna del precio.
- **Causa:** `gviz` infiere un tipo por columna (número o texto) y **borra las celdas del tipo minoritario**. El texto del encabezado en una columna numérica se pierde, y una celda suelta que no encaje con el resto de su columna (p. ej. «S/N» entre números) también se pierde en silencio.
- **Solución:** leer con `.../export?format=csv&gid=<gid de la pestaña>`, que entrega el CSV tal cual, con todos los encabezados y sin caché (`no-store`). Las columnas se buscan por el **nombre** del encabezado, no por su posición.
- **Lección:** no usar `gviz` para datos con columnas mixtas. Si se borra y recrea la pestaña, cambia el `gid` (constante `SHEET_GID` en `index.html`).

## 13. Cientos de fotos pedidas al desplazarse rápido (resuelto; sustituido por la paginación, ver #17)
- **Síntoma:** al recorrer a toda velocidad las 577 tarjetas de Semipermanentes, el navegador pedía cientos de fotos de 2048 px que nadie llegaba a ver; las visibles quedaban en cola y tardaban más de 14 s.
- **Causa:** `loading="lazy"` nativo decide por distancia al viewport, no por el tiempo que la tarjeta permanece a la vista; las peticiones en curso no se cancelan.
- **Solución:** las tarjetas del listado llevan `data-src` y una foto solo se pide si su tarjeta se queda a la vista `PHOTO_DWELL_MS` (160 ms). Resultado medido: una pasada completa por las 577 tarjetas pidió 12 fotos.
- **Lección:** con listas largas y fotos pesadas, el `lazy` nativo no basta. *(La carga por tandas de 36 con centinela y la espera de 160 ms se eliminaron al paginar: ahora solo existen 24 tarjetas en pantalla. Ver #17.)*

## 14. Pruebas con `IntersectionObserver` en una pestaña en segundo plano
- **Síntoma:** en el navegador de pruebas la carga progresiva «no avanzaba» y parecía un bug.
- **Causa:** la pestaña de pruebas estaba en segundo plano y el navegador no ejecuta ahí el ciclo de render del que depende `IntersectionObserver`.
- **Lección:** antes de dar por fallida una prueba con observadores, animaciones o `IntersectionObserver`, **poner la pestaña al frente** (`tabs_select`) y repetir.

## 15. Datos del Sheet en MAYÚSCULAS y sin tildes
- La Base trae los nombres en mayúsculas, sin tildes y con errores de dedo. El catálogo los presenta con `prettyName()` (Título, tildes de un diccionario `ACCENTS`, `15ML` → `15 ml`, marcas como `M&Y` intactas). Los errores de ortografía en español conocidos (`EXTENCION`, `ACRILCO`, `COLOLRES`) se corrigen ahí; los demás hay que corregirlos **en el Sheet**: `WITHE`/`WITHIE`, `CHESSE`, `BLOSSON`, `PAINLING`/`PAILING`, `ARITOS`, `XUND`, `LARGUE`, `PLATINIUM`, y la marca escrita `Vanessa`/`Vanesa`, `KNAILS`/`Kinails`.
- Para que una palabra nueva lleve tilde, agregarla a `ACCENTS` (clave sin tilde, en minúscula).

## 16. El contador de favoritos no aparecía al recargar la página (resuelto)
- **Causa:** `updateFavBadge()` solo se llamaba al agregar o quitar un favorito, nunca al iniciar.
- **Solución:** se llama en `init()`.

## 17. Listado paginado de 24 en 24 con la página en la URL
- **Problema:** una categoría de 400-500 productos dibujaba todas las tarjetas (por tandas) y acumulaba fotos pesadas.
- **Solución:** `PRODUCTOS_POR_PAGINA = 24` (constante al inicio de la sección «Listado de una categoría»; subirla cuando las fotos sean livianas). Solo se dibujan, y solo piden foto, las tarjetas de la página actual; los datos ya están en memoria y el cambio de página es instantáneo (6 clics seguidos tardaron 40 ms). Fotos con `loading="lazy" decoding="async" width="400" height="400"`.
- **URL:** `#/gel/2` (la página 1 es `#/gel`). Una página fuera de rango o inválida (`/99`, `/0`, `/abc`) muestra la última o la primera y **corrige la URL** (`syncUrl()`). Cada cambio de página en la lista normal es una entrada del historial (`history.state = {cat, entry, d}`; `d` cuenta las páginas recorridas para que «Todas las categorías» salte directo a la portada con `history.go(-(d+1))`).
- **Buscador:** filtra los productos de **toda** la categoría (`view.all`), con la misma lógica de siempre. Los resultados se paginan igual, **no** tocan la URL ni el historial; cada texto nuevo vuelve a la página 1 (con 140 ms de espera al teclear) y al borrar el texto se regresa a la página que se estaba viendo (`view.browsePage`). El contador de arriba dice «N resultados»; en celular, mientras se busca, baja debajo del control.
- **Controles:** píldora igual a la del buscador y selector de columnas. Escritorio: «Mostrando 25–48 de 312 productos» a la izquierda y «‹ Anterior 1 2 3 4 5 … 25 Siguiente ›» a la derecha (siempre 7 casillas para que no se muevan). Celular (≤760 px): «‹ Página 2 de 12 ›» y el «Mostrando…» debajo. Con 24 productos o menos no se muestra nada. Con teclado el foco permanece en los controles al redibujarse.
- **Lección:** el contenedor que scrollea en escritorio es la grilla (`.listing>.grid`) y en celular la página; al cambiar de página se hace `catGrid.scrollTop = 0` y, si el encabezado del listado quedó fuera de vista, se sube la página hasta él (`scrollToListStart()`). `performance.getEntriesByType('resource')` solo lista una foto cuando **termina** de descargar: para contar peticiones hay que esperar o mirar la red.

## 18. Productos con variantes: una tarjeta por «Código padre» (2026-10-21)
- **Problema:** el catálogo pintaba una tarjeta por fila: un producto con 3 variantes (`SEMI007` + `-06`, `-08`, `-09`) salía 4 veces.
- **Reglas (acordadas con el dueño, ver la muestra del selector):** las filas con el mismo «Código padre» (columna A) son un producto. Título y foto de la tarjeta = fila del padre (SKU = código padre y «Variante» vacía; **aunque el padre no tenga «Sí»**, `GEL001`); sin fila de padre, la parte común de los nombres (sin conectores sueltos al final; si queda menos de 2 palabras, el nombre de la primera variante) y la foto de la primera variante. Se muestra el producto si **al menos una fila** del grupo tiene «Sí»; el selector lista **solo las filas con «Sí»**. Con **menos de 2 opciones visibles no hay selector**: tarjeta normal de esa fila (la variante; el padre si es la única). Hoy (hoja del 2026-10-21): 1.013 filas visibles → **673 tarjetas** (46 con selector, 627 normales); Semipermanentes 589→414, Gel 176→51, Pestañas 57→39, Puntas para dril 36→20.
- **Código:** `buildCatalog` ahora guarda `parent` y `variante` y conserva los padres no visibles con `vis:false` solo si su grupo se muestra. `setCatalog` separa `PRODUCTS` (filas visibles; lo que usan favoritos, cotización y poda) de `ITEMS` (tarjetas del listado: `{kind:'row'}` o `{kind:'group'}` con `options`), y `GROUP_BY_ID`. **Los conteos de la portada, de cada categoría y la paginación cuentan tarjetas (`ITEMS`), no filas (`PRODUCTS`).** El caché del celular pasó a `catalogCache_v2` (guarda padre y variante); el v1 se borra solo.
- **Ficha:** `openGroupModal` + `showGroupView`. Sin opción elegida se ve la foto del padre; al elegir cambian foto, código, nombre, medida y precio, y el botón de favoritos guarda esa variante (cada una conserva su SKU real; sin elegir queda deshabilitado «Elige una opción»). Tocar otra vez la opción vuelve a la foto del producto. Cada opción es una **foto circular sin caja ni fondo gris, con el número debajo** (la elegida lleva doble anillo rosado y una marca de visto; el anillo fino de 1 px es lo único que define el círculo sobre el blanco). Hasta `MINIATURAS_HASTA = 12` opciones llevan foto (4 por fila en celular); con más, solo el código en píldoras de borde fino (cada miniatura descarga hoy la foto completa del servidor lento; cuando existan las copias `web400`, subir ese límite). Con más de 12 opciones el bloque se desplaza. Precio y favoritos quedan fijos al pie de la ficha (`.is-variants .modal-footer{position:sticky}`).
- **Tarjeta:** etiqueta «N opciones» sobre la foto; el corazón de una tarjeta con variantes **abre la ficha** (no guarda a ciegas el padre). Búsqueda: cada tarjeta con variantes concentra los textos de todas sus filas (`q`), así que se encuentra por cualquier código, nombre o variante.
- **Decisión del dueño:** las líneas `SEMICH…` (Charlotte) y `SEMIKN…` (Kinails) **no se agrupan**: cada una sigue como producto aparte, sin variantes, como las maneja la empresa. No se agrupa por parecido de nombres; toda agrupación sale de la columna «Código padre» de la hoja.
- **Lección:** si en el futuro la columna «Código padre» o «Variante» cambiara de nombre, el catálogo no se rompe: cada fila vuelve a ser su propio producto. «Variante» y «Código padre» no son obligatorias.

## 19. Visor de producto: foto con margen, X fuera de la foto y «salto» al cambiar de variante (2026-10-21)
- **Problema 1:** la foto del visor tenía 24 px de relleno y se encogía al 88 %, así que ocupaba solo una parte del contenedor; la X quedaba sobre el margen, no sobre la imagen.
- **Problema 2:** al elegir otra variante se veía la foto anterior y luego «saltaba» a la nueva. Medido: a los 175 ms la `<img>` ya era visible con el `src` nuevo pero seguía descargando (~1 s); el navegador pinta el bitmap anterior hasta que llega el nuevo.
- **Arreglo:** `.modal-photo` sin relleno y `img` al 100 % (`object-fit:contain`, nunca recorta); X de 38 px, blanca translúcida, sobre la foto (solo `.product-modal>.modal-close`; las de favoritos y pedido no cambian); borde del visor en celular 12 px; se quitó la proporción 6:5 de escritorio. Es el mismo visor para productos simples y con variantes. En `showGalleryImage` la foto nueva se precarga y decodifica (`Image.decode()`) **antes** del fundido; un contador (`galToken`) descarta cambios viejos si se tocan varias opciones seguidas; tope de 2,5 s.
- **Lección:** cambiar `img.src` no cambia lo que se ve hasta que la imagen nueva carga. Para fotos remotas, precargar y decodificar primero y hacer el fundido después; y medir el estado (`img.complete`) en el tiempo antes de dar el salto por resuelto.

## 20. iPhone (Safari): la foto del visor queda «cortada» tras elegir una variante que estaba abajo (2026-10-21)
- **Síntoma (solo en iPhone, no se ve en escritorio ni simulando celular):** con una ficha de 34 opciones, se baja por la lista, se elige la 038 y al volver a subir la foto aparece dibujada solo hasta donde llegaba la parte visible; arriba queda en blanco. Captura del dueño (iPhone 15 Pro Max, Safari).
- **Causa probable (no se pudo reproducir fuera de iOS):** Safari no dibuja la parte de una imagen que está fuera de pantalla cuando esa imagen cambia mientras se desplaza el contenedor; se combinaba con `transform` residual en `.product-modal` (`translateY(0) scale(1)`), `backdrop-filter` en la X dentro del contenedor con scroll, esquinas redondeadas con `overflow:hidden` y una transición de `opacity` en la imagen.
- **Medidas:** (1) al elegir variante o miniatura, la ficha sube sola hasta la foto (`scrollModalToPhoto`) y el cambio de foto espera a que esté a la vista (`waitPhotoInView`); (2) `transform:none` al terminar de abrir; (3) la X sin `backdrop-filter`; (4) la foto del visor en su propia capa (`translateZ(0)`, `isolation:isolate`); (5) `overscroll-behavior:contain`.
- **Estado:** verificado en escritorio (secuencia: sube → foto oculta → cambia → visible). **Falta confirmar en un iPhone real.** Si persiste, probar quitar el fundido de la foto (`.is-swap`) o dibujar la foto como `background-image`.
- **Lección:** los fallos de dibujo de Safari/iOS no aparecen en el emulador de Chrome; para una ficha con scroll, evitar cambiar imágenes que están fuera de pantalla y probar siempre en un iPhone real antes de dar el arreglo por cerrado.

## 21. Favoritos sustituidos por carrito con cantidades, barra inferior y ciudad sugerida (2026-10-21)
- **Pedido del dueño:** «Agregar al carrito» en lugar de favoritos; carrito con animación llamativa hasta el primer toque; botón final tipo pedido por WhatsApp; nombre y ciudad, con la ciudad rellenada sola según la ubicación.
- **Decisiones (elegidas con el dueño):** icono de carrito arriba **+ barra inferior** («2 productos · $ 2.300 · Ver carrito»); **cantidades** por producto (− 2 +) con total estimado; botón **«Hacer pedido por WhatsApp»** (no «comprar», porque no hay cobro en la página); ciudad por IP desde **función propia** (sin terceros).
- **Cómo funciona:** el carrito vive en `localStorage` (`cart` = SKU→cantidad, `cartSeen`, `customer`). Cada variante es su propio SKU. Los favoritos guardados antes **no se migran** (clave `favorites` ignorada). El botón de la tarjeta agrega/quita; los productos con variantes abren la ficha. Animación del carrito (`body:not(.cart-seen)`): onda + vaivén cada 2,6 s; se detiene al abrir el carrito por primera vez y se respeta `prefers-reduced-motion`. Al agregar, la foto «vuela» al carrito (`flyToCart`, Web Animations API).
- **Ciudad:** `functions/api/ciudad.js` (Cloudflare Pages Function) devuelve `request.cf.city`. El catálogo la pide **solo al abrir el pedido**, solo si el campo está vacío y no se recuerda una ciudad; es editable y muestra «Detectada por tu conexión». Si la función no existe (GitHub Pages, servidor local) el campo queda vacío y se escribe a mano. **Precisión limitada:** desde una conexión de Malambo/Barranquilla devolvió «Barranquilla»; con datos móviles puede decir otra ciudad.
- **Despliegue:** para que la función exista hay que desplegar **desde la raíz del repo** (donde está `functions/`): `wrangler pages deploy <carpeta con index.html y assets> --project-name catalogo-supremenails ...`. Si se despliega desde otra carpeta, `/api/ciudad` no se publica.
- **Detalle iOS:** los campos del pedido usan 16 px en celular; con menos, Safari hace zoom al enfocarlos.
- **Lección:** al renombrar un sistema (favoritos→carrito) buscar también los nombres con mayúsculas intermedias (`updateFavBadge`): una llamada olvidada en `init()` dejó el catálogo sin cargar hasta que se detectó en la consola.

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
12. **Datos de Google Sheets: leer con `export?format=csv&gid=`, nunca con `gviz`** (ver entrada 12), y buscar columnas por nombre de encabezado.
13. **Listas largas con fotos pesadas:** paginar (`PRODUCTOS_POR_PAGINA`) y dibujar solo la página actual (entrada 17); nunca dibujar cientos de tarjetas con fotos. Probar siempre con la pestaña al frente (entrada 14).
14. **Rutas con página (`#/slug/N`):** toda página nueva de la lista normal es una entrada del historial; si se añade otra pantalla con su propia ruta, mantener el contador `d` de `history.state` o «Todas las categorías» no volverá a la portada.
15. **Contar tarjetas, no filas:** todo número que ve el cliente (portada, categoría, «Mostrando…», «N resultados») sale de `ITEMS`; `PRODUCTS` es solo la lista de filas con SKU para favoritos y cotización (entrada 18).
16. **Cambio de foto con fundido:** precargar y decodificar la foto nueva antes de ocultar la anterior (entrada 19); nunca cambiar `src` y mostrar de inmediato una imagen remota que aún no cargó.
17. **Probar en iPhone real** todo cambio en ventanas con scroll, capas, `transform`, `backdrop-filter` o cambios de imagen (entrada 20): el emulador de escritorio no reproduce los fallos de dibujo de Safari.
18. **Tras renombrar un sistema, buscar todas las variantes del nombre** (`grep -i fav` y también `Fav` dentro de camelCase) y abrir la página con la consola visible antes de entregar (entrada 21).
