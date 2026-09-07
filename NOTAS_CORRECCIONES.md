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

---

## Reglas generales a respetar de aquí en adelante
1. **Consistencia entre pestañas**: cualquier cambio de tamaño, espaciado, padding o gap en tarjetas/imágenes de una pestaña (Esmaltes/Colecciones/Herramientas) debe evaluarse para las otras dos, salvo que el usuario diga explícitamente que es exclusivo de una.
2. **Medir antes de fijar tamaños "iguales a"**: cuando se pida que un elemento mida "lo mismo que" otro con contenido variable, usar JS para medir y fijar en píxeles; no confiar en trucos de CSS Grid/Flexbox con `auto`/`stretch` sin verificar visualmente el resultado.
3. **Cuidado con `align-items:stretch` (valor por defecto de Grid/Flex)**: revisar si el contenedor padre está estirando la tarjeta/columna más de lo necesario antes de usar `margin-top:auto` para anclar elementos al fondo.
4. **Verificar en navegador tras cada cambio** (desktop y, cuando aplique, mobile) antes de dar el cambio por terminado.
5. **Ante texto/elemento que "no se borra"**: comprobar si es HTML real o parte de una imagen antes de intentar editarlo como texto.
6. **Ante cambios no reflejados**: sospechar caché del navegador (renombrar archivo o forzar recarga) antes de asumir que el código está mal.
