# Bitácora del proyecto — Catálogo Supreme Nails

> Para retomar el trabajo en otro computador sin perder contexto.
> Última actualización: **2026-10-20** (el catálogo que lee el Sheet ya está en `main` — commit `aac91cb` — y **publicado en producción**). Si algo de aquí contradice lo que ves en el código o en los paneles, **manda lo que ves** y corrige este documento.
> Este repositorio es **público**: aquí no hay claves ni correos. Sí aparecen el ID de la Base de Google y el `gid` de su pestaña (`index.html`, constantes `SHEET_ID` y `SHEET_GID`): son necesarios para que la página lea el Sheet, que es **de solo lectura para el público**. Nadie puede editarlo ni borrarlo desde la página.

Convención: **[VERIFICADO]** = se comprobó con una herramienta ese día. **[DECIDIDO]** = el dueño del proyecto lo decidió. **[PENDIENTE]** = falta decisión o acción.

---

## 1. Qué es este proyecto

Catálogo web de **Supreme Nails Professional**: página estática de un solo archivo (`index.html`) pensada para abrirse desde el enlace de Instagram, **optimizada al 100 % para celular**. Los clientes ven productos, marcan favoritos y piden cotización por WhatsApp.

Reglas permanentes (también en `CLAUDE.md`):
- **[DECIDIDO]** Lo que está en GitHub es la fuente de la verdad del código.
- **[DECIDIDO]** Todo pedido de diseño/UX debe entregarse en su versión más pulida y profesional, no la más rápida. Si hay varios enfoques razonables, proponer 2–3 alternativas antes de programar.
- Verificar visualmente antes de dar algo por terminado.
- Registrar los errores técnicos en `NOTAS_CORRECCIONES.md` y consultarlo antes de tocar layout/CSS.

## 2. Dónde vive cada cosa

| Pieza | Nombre / lugar | Notas |
|---|---|---|
| Repositorio | GitHub `trespapaginas-source/catalogo-supremenails`, rama `main` | Público |
| Enlace público actual | GitHub Pages: `https://trespapaginas-source.github.io/catalogo-supremenails/` | **[VERIFICADO]** activado con compilación legacy desde `main` / raíz. Se actualiza solo con cada push |
| Cloudflare Pages | Proyecto `catalogo-supremenails` → `catalogo-supremenails.pages.dev` | Ver problema en sección 7 |
| Otros proyectos Pages parecidos | `catalogo-supreme-nails-edit` (sin Git), `supreme-nails` (con Git) | **[PENDIENTE]** confirmar cuál es el enlace oficial para Instagram |
| Carpeta local (computador 1) | `.../compartido_pc_portatil/supreme_catalogo` | |
| Archivos del repo | `index.html`, `assets/`, `CLAUDE.md`, `NOTAS_CORRECCIONES.md`, `BITACORA.md` | `AGENTS.md` existía sin seguimiento en el computador 1; no lo creó Claude |

## 3. Estado actual del catálogo

**Producción (`https://catalogo-supremenails.pages.dev`), publicada el 2026-10-20:** despliegue `25e38926` (commit `aac91cb`, rama `main`). Punto de retorno: el despliegue anterior `38f6aa42` (commit `0f60bdb`, 394 productos incrustados que leían de la CDN de Shopify); se restaura desde el panel de Cloudflare Pages → Despliegues → «Rollback» o volviendo a desplegar ese commit. **No se hizo `git push`** (Pages está sin conexión a GitHub: se sube por `wrangler pages deploy`).

**Desde el 2026-10-20 (rama `feat/catalogo-desde-sheet`, fusionada a `main` sin conflictos):** el catálogo **lee la Base de Google Sheets en vivo**. **[VERIFICADO]** en producción con la Base real: **995 productos** («Sí»), 12 categorías, todos con precio; consola sin errores; el dueño decidió dejar **visibles** `SEMIF006` a `SEMIF009`.
- Muestra solo las filas con **«Visible en catálogo» = SI/Sí**. Precio = «Precio de venta 1». Fotos = «Enlace foto 1…8».
- Las categorías se crean solas desde la columna «Categoría» (hoy 17 en la Base; 12 con productos con foto). Las 11 de siempre conservan su frase e ícono; hay frases e íconos propios para Puntas para dril, Pinceles, Aceites de cutícula, Lámparas, Monómeros y Dremel; una categoría nueva usa un ícono y frase genéricos (diccionario `CAT_META`).
- Carga: esqueletos con brillo suave; guarda el último catálogo en el celular (localStorage) y lo muestra al instante mientras actualiza por detrás; si Google falla, muestra el último guardado, y si no hay nada guardado, un mensaje con «Reintentar» y WhatsApp. Estado vacío si no hay ningún `SI`.
- Listado **paginado de 24 en 24** (`PRODUCTOS_POR_PAGINA` en `index.html`): solo se dibujan y piden foto las tarjetas de la página actual; la página va en la URL (`#/gel/2`, `#/gel` = página 1) y el botón «atrás», recargar y compartir el enlace la conservan; controles de página debajo de la lista (versión compacta «Página 2 de 12» en celular). Ver `NOTAS_CORRECCIONES.md` #17.
- Ficha de producto con galería (flechas, miniaturas y deslizar), etiquetas de marca y tipo; foto de reemplazo con el logo si falta o falla; precio «Consultar» si no hay precio.
- Botón «atrás» del celular: vuelve a las categorías en vez de sacar de la página; cada categoría tiene enlace directo (`#/gel`).
- Buscador por varias palabras, sin tildes ni mayúsculas, por nombre, marca, tipo y código; recorre **todos** los productos de la categoría (no solo la página visible) y pagina sus resultados igual (24 por página, «N resultados»).
- Nombres presentados en formato título con tildes (ver `NOTAS_CORRECCIONES.md` #15).
- Favoritos: se limpian solos si el producto deja de estar visible; se corrigió el contador al recargar.
- Funciones que siguen igual: favoritos en panel deslizable, cotización por WhatsApp (mismo número y mensaje), selector de 1/2/3 columnas.

Vista previa (misma versión): `https://prueba.catalogo-supremenails.pages.dev`. Para publicar de nuevo: carpeta temporal solo con `index.html` y `assets/` (`git archive main index.html assets`) y `wrangler pages deploy <carpeta> --project-name catalogo-supremenails --branch main`.

## 4. Fuente de datos oficial

- **[DECIDIDO]** La fuente de la verdad es el Google Sheet **`BASE PRODUCTOS SUPREME NAILS`**, pestaña `Lis-de-Pro-y-Ser` (~1.800 filas). El Sheet `Categoría-de-productos` está **obsoleto**.
- **[DECIDIDO 2026-10-20]** Precio público = **«Precio de venta 1»**. Visibilidad = columna **«Visible en catálogo»** con `SI`. Las fotos salen de las columnas **«Enlace foto 1» a «Enlace foto 8»** de la misma pestaña (URLs directas `.jpg` del Worker de captura: `…/fotos/<SKU>/<n>.jpg`).
- **Cómo lee el catálogo:** `https://docs.google.com/spreadsheets/d/<ID>/export?format=csv&gid=<GID>`. Funciona sin sesión porque el Sheet está compartido como «cualquiera con el enlace: lector» y Google permite la lectura desde otros dominios. No usar `gviz` (pierde datos; `NOTAS_CORRECCIONES.md` #12). Las columnas se buscan **por el nombre del encabezado**: si alguien renombra «Visible en catálogo», «Nombre», «Categoría», «Código Único (SKU)» o «Precio de venta 1», el catálogo muestra el error (o el último catálogo guardado). Alias aceptados para la visibilidad: `Visible en catálogo`, `DISPONIBLE_CATALOGO`, `Disponible catálogo`.
- **Permisos del Sheet (2026-10-20):** dueño: la cuenta del proyecto; editores: una cuenta del cliente y la cuenta de servicio de la app de captura; lectores: cualquiera con el enlace y otros dos correos. El público no puede editar ni borrar.
- **Estado de los datos (2026-10-20):** 1.800 productos; 995 con enlace de foto; 47 marcados `SI` (todos Semipermanentes). Hay 4 productos con foto que también están en la pestaña `No disponible` (`SEMIF006` a `SEMIF009`): conviene no marcarlos.
- Pestañas `No disponible` y `Eliminados`: el catálogo **no** las lee. La pestaña `Shopify` y `Shopify-Notas` las genera un programa a pedido («regenera»); no editarlas a mano.

## 5. Las fotos: R2 y la app de captura

Existe una app aparte ("Supreme Nails Captura Fotos"), que es un **Cloudflare Worker**. Se trabaja en **otro chat/proyecto** de Claude Code: sesión «Aplicativo web - fotos», carpeta `~/Descargas/Supreme Nail-portatil/` (código en `Supreme Nail/`, sin git; su propia `BITACORA.md`, `ENTREGA-CLIENTE/Checklist_entrega_tecnica.md` y guía del dueño `ENTREGA-CLIENTE/Guia_Catalogo_Supreme_Nails.html`). **Ese chat no toca este repo**; lo que cambia es la app de fotos y la hoja, de las que depende este catálogo. Leído a 2026-10-20 (bitácoras §39–§47 de ese proyecto):
- **Desde el 2026-10-20 la app SÍ escribe en la hoja:** al guardar/borrar fotos actualiza al instante `Foto` (I), `Cantidad de fotos` (J) y `Enlace foto 1..8` (N:U, por nombre de encabezado), y una revisión cada 15 min (minutos 7, 22, 37, 52) corrige solo celdas de enlaces desactualizadas. Sustituir una foto (misma clave) no toca la hoja.
- **«Visible en catálogo» = Sí automático** con la primera foto de un producto (solo si la celda estaba vacía, la fila no es «No fotografiar» y antes no tenía fotos; nunca pisa un «No»). Borrar todas las fotos no lo pasa a «No» (decisión pendiente del dueño).
- La columna V tiene desplegable estricto Sí/No en V8:V2807; la hoja tiene filtro básico A7:AB1807 y 1.000 filas libres (1808–2807).
- Una foto nueva queda en la clave R2 `{SKU}/{n}.jpg` (n=0 si es única) y se sirve en `/fotos/{SKU}/{n}.jpg` con `Cache-Control: private, max-age=60` (sin caché de Cloudflare). **No vaciar R2** mientras el catálogo use esos enlaces.
- Riesgo de fila nueva: **copiar la fila entera de otro producto** copia Foto/Cantidad/enlaces/Visible y deja «Foto = Sí» falso; se pide insertar una fila vacía y escribir los datos.
- Pendientes de ese lado que tocan al catálogo: copias web `web400/` y `web800/` (**no implementadas en el catálogo hasta que el dueño confirme**; las nuevas fotos tomadas con la app no tendrían copia → el catálogo debe caer a la original; ver NOTAS #17), regla ≤ 1 MB y quitar el recorte en la app (el dueño: «aún no»), qué hacer con «No disponible» (solo vive en la app de fotos, el catálogo no lo ve), privacidad de la hoja pública (columna H = precio mayorista queda descargable).
- **Antes se decía que no se modificaría la app: ya no es cierto.** (Dato histórico del 2026-10-19 abajo.)

**[VERIFICADO]** leyendo su código local y la versión publicada:
- Worker de producción: `supreme-nails-captura-fotos-production` (existe también `-staging`). Versiones recientes del 2026-10-08/09.
- Las fotos de producción están en el bucket R2 **`catalogo-fotos-prod`**, con respaldo en `catalogo-fotos-prod-backup` (y `catalogo-fotos-test` / `-test-backup` para pruebas).
- **Nombres de archivo (dato del 2026-10-19, desactualizado):** `<SKU>-1.jpg`… Hoy las claves son `{SKU}/{n}.jpg` (ver arriba). Los códigos solo admiten letras, números y guiones.
- Los reemplazos mueven la foto anterior a `trash/` (no se borra de verdad).
- La disponibilidad que usa esa app se guarda en R2 en `estado/no-disponibles.json`, **no** en el Sheet.
- Rutas de la app: `/api/productos`, `/api/fotos` (GET/POST/DELETE), `/fotos/<clave>`, y rutas `/admin/...`. Tiene un cron cada 15 minutos.
- **Advertencia:** la app de captura **no tiene autenticación propia**. Tratar su enlace como privado.
- **Desactualizado:** el `wrangler.toml` de la carpeta local de esa app (en el computador 1, carpeta `Documentos/Supreme Nail`) todavía apunta a la hoja vieja `Categoría-de-productos`. Lo que está **publicado** ya lee la Base. Si alguien redespliega desde esa carpeta sin corregirlo, el Worker leería la hoja obsoleta.

## 6. Arquitectura implementada (reemplaza al plan del 2026-10-19)

El plan anterior (Worker propio con caché + panel de administración con contraseña para subir fotos a R2) **se descartó por ahora** (decisión del dueño, 2026-10-20: «por ahora no»). Lo implementado es más simple:

1. El cliente edita el Google Sheet: nombre, precio, categoría, enlaces de foto y `Visible en catálogo`.
2. La página estática (`index.html`) descarga el CSV de la pestaña, lo interpreta en el navegador y guarda una copia en el celular.
3. Las fotos se piden directamente al Worker de captura (`…workers.dev/fotos/…`); no se toca esa app.
4. No hay servidor propio, ni claves, ni R2 en el catálogo.

**Límites conocidos:**
- **Peso y velocidad de las fotos (principal pendiente):** las fotos son de 2048 px; en una muestra de 40, media 224 KB, mediana 142 KB, máximo 2,8 MB, y cada una tarda del orden de 1 s en el servidor de fotos (1,5–7 s en las pruebas con varias en paralelo). El Worker las sirve con caché de solo 60 s. Opciones: (a) subir las fotos ya reducidas (~800 px); (b) redimensionar con Cloudflare Images/Image Resizing en un dominio propio; (c) caché larga delante del Worker. Hay que revisar los límites vigentes de solicitudes del plan gratuito de Workers si el tráfico de Instagram crece.
- Google puede limitar las peticiones al CSV con mucho tráfico simultáneo; el catálogo ya guarda copia en el celular y actualiza solo al volver tras 5 minutos. Si hiciera falta, la salida es un proxy con caché de unos minutos (Pages Function).
- Si se borra y recrea la pestaña `Lis-de-Pro-y-Ser`, cambia el `gid`: actualizar `SHEET_GID`.
- Un panel para subir fotos desde el catálogo sigue siendo posible más adelante (ver el plan en el historial de git de este archivo).

## 7. Cloudflare Pages: por qué no se actualiza

- **[VERIFICADO]** En la cuenta de Cloudflare, el proyecto `catalogo-supremenails` figura con **Git Provider = No**: **no está conectado a GitHub**. Por eso un push nunca lo actualiza. Los despliegues anteriores que "funcionaban" probablemente fueron subidas directas (inferencia: sin Git conectado no hay otra vía automática); no se revisó el historial de despliegues.
- Soluciones: (1) subida directa con `wrangler pages deploy` (inmediata, se repite en cada cambio); (2) **conectar el proyecto a GitHub desde el panel de Cloudflare** (lo hace el dueño con un clic de autorización; luego se actualiza solo). La segunda es la adecuada para entregar al cliente.
- **[PENDIENTE]** Se ofreció subir la versión actual por subida directa; no se ha hecho.

**Verificado el 2026-10-20:** la subida directa funciona. `wrangler` 4.151 (copia en el caché de npx) con sesión OAuth y permiso `pages (write)`; el proyecto tiene 3 despliegues de producción desde `main` y el último, de hace un mes, salió de esta carpeta (`0f60bdb`). Se hizo un despliegue **solo de vista previa** (`--branch prueba`) y la producción no cambió. Para desplegar **no subir la raíz del repo** (contiene capturas sueltas, el clon de LUNE y las bitácoras): armar una carpeta temporal con solo `index.html` y `assets/`, y ejecutar `wrangler pages deploy <carpeta> --project-name catalogo-supremenails --branch <rama>` (producción = `main`). El token no lista permiso de R2: repetir `wrangler login` solo si algún día se usa R2.

## 8. Decisiones abiertas y pendientes

**Resueltas el 2026-10-20:** precio público = Precio de venta 1; visibilidad = columna «Visible en catálogo» (`SI`); las fotos están en el Sheet; no se hará por ahora el panel de subida de fotos; Precio 2 y la lista completa pueden quedar accesibles para quien descargue el CSV; la categoría se crea sola desde el Sheet.

**Pendientes:**
1. ~~Marcar `SI`~~ **Hecho (2026-10-20):** los 995 productos con foto están en «Sí», incluidos `SEMIF006`–`009` (el dueño decidió dejarlos visibles). Desde ahora la app de fotos pone «Sí» sola con la primera foto (ver sección 5).
2. ~~Fusionar y publicar~~ **Hecho (2026-10-20).** Falta solo que el dueño revise el sitio público en un celular real y decidir si se hace `git push` de `main`.
   - Propuestas sin responder: página oculta `#/revision` (filas marcadas «Sí» que se saltan y por qué) y freno si el catálogo baja de golpe; resaltado de códigos repetidos en la columna B de la hoja.
3. **Peso de las fotos** (sección 6). El dueño ya optimizó las 18 más pesadas **conservando las mismas claves en R2** (las URL de «Enlace foto 1…8» no cambian; R2 no se vacía). **Siguiente paso, solo cuando el dueño lo confirme (no implementado):** copias livianas en `/fotos/web400/{SKU}/{n}.webp` (tarjetas) y `/fotos/web800/{SKU}/{n}.webp` (ficha), cambiando en la URL `/fotos/{SKU}/{n}.jpg` por esas rutas, con respaldo a la foto original si la copia no existe (evento `error` de la imagen). Entonces también se puede subir `PRODUCTOS_POR_PAGINA`.
4. Cuál proyecto de Cloudflare Pages es el oficial para Instagram (`catalogo-supremenails`, `catalogo-supreme-nails-edit` o `supreme-nails`) y **conectar Pages a GitHub** con un clic del dueño para que se actualice con cada push.
5. Corregir en el Sheet los errores de ortografía listados en `NOTAS_CORRECCIONES.md` #15.
6. Entrega al cliente: que tenga su propia cuenta de Cloudflare y GitHub (transferir el repo, dejar Pages bajo su cuenta) y una guía de una página: marcar `SI`, pegar el enlace de foto, no renombrar encabezados.

## 9. Accesos y herramientas (en el computador 1, a 2026-10-19)

- GitHub CLI con sesión de la cuenta dueña del repo (permisos `repo`, `read:org`, `gist`).
- `wrangler` con sesión OAuth de Cloudflare; permite Workers, KV, D1, Pages y también listar buckets R2. La lista de permisos que muestra `wrangler whoami` no incluye R2, pero el listado de buckets funcionó. **Si algo con R2 falla, repetir `wrangler login`** y aceptar el permiso de R2.
- Conector de Google Drive (lectura de las hojas). No se escribió nada en ninguna hoja.
- No hay `numpy`, `rembg` ni acceso a internet para instalar paquetes de Python en ese entorno; para imágenes solo se usó Pillow.
- En el computador nuevo esto hay que volver a configurarlo: `gh auth login`, `wrangler login`, conector de Drive.

## 10. Experimento: edición de fotos con fondo blanco (2026-10-19)

El dueño pidió editar las fotos de una carpeta de prueba (12 frascos de gel "Shiny Diamond", SKU `GELMY018-01` a `-012`) con fondo blanco estilo Shopify, iluminación correcta, mismo tamaño y centrado.

- No se pudo usar PhotoCraft/Livecraft: Claude no controla aplicaciones de escritorio. Se hizo por código (Pillow).
- **Primer intento: mal.** Segmentó con un umbral de oscuridad y **cortó la parte baja del frasco** (reflejos del gris de la mesa). El dueño lo rechazó con razón.
- **Segundo intento:** estimó el fondo fila a fila y segmentó por diferencia (umbral ≈118), con cierre/apertura morfológica, y verificó el contorno sobre el original. Resultado: frasco completo, 58 % del alto del lienzo de 2000×2000, centrado, sombra de contacto suave.
- **El dueño lo calificó como malo** ("una porquería"). Es decir: **este método no está aprobado** y no se debe aplicar a todo el catálogo. No se supo la objeción exacta (recorte, luz, tamaño o sombra). Un recorte con script no alcanza calidad de estudio con productos negros y brillantes; considerar un editor con herramientas de recorte/retoque, repetir las fotos con caja de luz, o evaluar la función de quitar fondo que la app de captura parece tener (hay un script `quitar-fondo.mjs` en su carpeta; no se revisó).
- El script no quedó guardado en el repo. Lección: nunca confiar en un umbral simple y verificar la máscara sobre el original antes de entregar.

## 11. Cómo retomar en el otro computador

1. Clonar: `git clone https://github.com/trespapaginas-source/catalogo-supremenails` y leer `CLAUDE.md`, `NOTAS_CORRECCIONES.md` y este archivo.
2. Autenticar `gh` y `wrangler`; reconectar el conector de Google Drive si hace falta.
3. Cambiar a la rama `feat/catalogo-desde-sheet` (`git switch feat/catalogo-desde-sheet`) y revisar la sección 3.
4. Seguir con los pendientes de la sección 8.

## 12. Historial resumido del trabajo previo

- Se reconstruyó el catálogo como sitio guiado por datos a partir de una importación real de productos.
- Se corrigieron múltiples problemas de layout (brechas de precio, tamaños de foto, desbordes de título, alineación del buscador, tamaño de foto en el modal, panel de favoritos, el atributo `[hidden]` que perdía contra `display`). Detalle en `NOTAS_CORRECCIONES.md`.
- Un intento de sincronizar con GitHub chocó con cambios locales; el dueño ordenó descartar lo local y trabajar solo con GitHub.
- Se activó GitHub Pages como enlace público mientras se diagnosticaba Cloudflare.
- **2026-10-20:** el catálogo pasó a leer la Base de Google en vivo (rama `feat/catalogo-desde-sheet`); se verificó el despliegue en Cloudflare con una vista previa; se midieron las fotos (sección 6). Se descartó la pestaña intermedia `Catalogo_Web` y el Worker/panel de fotos.
