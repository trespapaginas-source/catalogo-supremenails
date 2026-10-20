# Bitácora del proyecto — Catálogo Supreme Nails

> Para retomar el trabajo en otro computador sin perder contexto.
> Última actualización: **2026-10-19**. Si algo de aquí contradice lo que ves en el código o en los paneles, **manda lo que ves** y corrige este documento.
> Este repositorio es **público**: aquí no hay claves, correos, IDs de cuenta ni IDs de hojas. Esos datos se consultan en Cloudflare / Google Drive.

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

## 3. Estado actual del catálogo (código en `main`)

Último commit al momento de escribir esto: `0f60bdb` ("Give product photo tiles a soft neutral background").

Funciones ya implementadas **[VERIFICADO en sesiones previas con capturas]**:
- Inicio con categorías y página de categoría con rejilla de productos.
- Fondo de página rosado con logo; versión **vertical** del fondo para celular (`assets/fondo_c_vertical.png`).
- Tarjetas de producto 1:1, tamaños uniformes, selector de 2/3 columnas en móvil.
- Buscador dentro de cada categoría (píldora con búsqueda + conmutador de vista), con filtro sin acentos.
- Ventana emergente de producto (foto grande).
- Favoritos con corazón y contador en la barra superior; lista de favoritos como **panel deslizable** (no página aparte) con X para cerrar; 1 columna si hay un producto, 2 si hay más.
- Botón **Cotizar por WhatsApp**: pide nombre y ciudad (no el teléfono) y abre `wa.me` con el mensaje "Hola, quiero cotizar los siguientes productos" + nombre y código de cada producto. Número configurado: constante `WHATSAPP_NUMBER` en `index.html`.
- Fondo neutro suave detrás de las fotos (las fotos de origen son inconsistentes).

Cómo se alimenta hoy: los productos están **incrustados** en `index.html` (arreglo `PRODUCTS` y `CATEGORIES`), con forma `{sku, name, cat, price, medida, color, img, desc}`. Las imágenes salen del CDN de Shopify (`cdn.shopify.com/.../files/<SKU>.jpg`). **No hay CMS ni backend.** Cambiar un precio o una foto hoy exige editar el código.

## 4. Fuente de datos oficial

- **[DECIDIDO]** La fuente de la verdad de todo es el Google Sheet **`BASE PRODUCTOS SUPREME NAILS`**, pestaña principal `Lis-de-Pro-y-Ser` (~1.800 filas).
- **[DECIDIDO]** El Google Sheet **`Categoría-de-productos`** (pestañas por categoría y `NO_DISPONIBLES`) está **obsoleto**. No usarlo.
- **[VERIFICADO]** Se confirmó de tres formas: (1) la app de captura ya desplegada devuelve 1.800 productos con la estructura de la Base; (2) la Base fue modificada el 2026-10-19, la vieja por última vez el 2026-08-24; (3) la estructura de columnas coincide solo con la Base.
- Otras hojas del Drive son copias o proyectos ajenos al catálogo (cobros, CRM, ERP, simuladores). `Catalogo_Supreme_Nails` (539 filas, sin fotos) y `Prueba - Captura Fotos Supreme Nails` (datos de prueba `TEST-001`…) **no** son la fuente.

Columnas de `Lis-de-Pro-y-Ser` **[VERIFICADO]**: Código padre, Código Único (SKU), Variante, Nombre, Categoría, Tipo, Precio de venta 1, Precio de venta 2, Foto, Cantidad de fotos, Marca, Contenido, ID.

Problemas de esa hoja para leerla desde el catálogo:
- Los encabezados están en la **fila 9**, bajo un bloque con celdas combinadas (NIT, enlaces).
- Los precios son **texto** con formato colombiano (`8.100,00`).
- Hay **dos precios**; no se ha definido cuál es el público.
- "Foto" es solo Sí/No (y "Cantidad de fotos" un número); **no hay URLs**. "ID" está vacía.
- La categoría de la hoja (`ACEITE DE CUTICULA`) no coincide con las categorías del catálogo; hay que cruzarlas.
- Pestañas adicionales: `No disponible` (~500 filas, con "Fotos tomadas" Sí/No) y `Eliminados` (~30 filas; su columna Nota dice "Foto en R2: <SKU>.jpg").

## 5. Las fotos: R2 y la app de captura

Existe una app aparte, ya terminada ("Supreme Nails Captura Fotos"), que es un **Cloudflare Worker**. **[DECIDIDO]** No se le va a modificar nada.

**[VERIFICADO]** leyendo su código local y la versión publicada:
- Worker de producción: `supreme-nails-captura-fotos-production` (existe también `-staging`). Versiones recientes del 2026-10-08/09.
- Las fotos de producción están en el bucket R2 **`catalogo-fotos-prod`**, con respaldo en `catalogo-fotos-prod-backup` (y `catalogo-fotos-test` / `-test-backup` para pruebas).
- **Nombres de archivo:** `<SKU>-1.jpg`, `<SKU>-2.jpg`… y `<SKU>.jpg` cuando es una sola foto sin número. Los códigos solo admiten letras, números y guiones.
- Los reemplazos mueven la foto anterior a `trash/` (no se borra de verdad).
- La disponibilidad que usa esa app se guarda en R2 en `estado/no-disponibles.json`, **no** en el Sheet.
- Rutas de la app: `/api/productos`, `/api/fotos` (GET/POST/DELETE), `/fotos/<clave>`, y rutas `/admin/...`. Tiene un cron cada 15 minutos.
- **Advertencia:** la app de captura **no tiene autenticación propia**. Tratar su enlace como privado.
- **Desactualizado:** el `wrangler.toml` de la carpeta local de esa app (en el computador 1, carpeta `Documentos/Supreme Nail`) todavía apunta a la hoja vieja `Categoría-de-productos`. Lo que está **publicado** ya lee la Base. Si alguien redespliega desde esa carpeta sin corregirlo, el Worker leería la hoja obsoleta.

## 6. Plan acordado (arquitectura) — aún NO implementado

Objetivo del dueño: **entregar el proyecto al cliente y desligarse**; el cliente no depende de él ni habrá mantenimiento. Por eso: pocas piezas, todas en cuentas del cliente, sin claves que caduquen.

Flujo propuesto (opción A, **recomendada por Claude**, el dueño no la ha confirmado por nombre pero la pidió en esencia):
1. El cliente edita el Google Sheet (nombres, precios, y una columna **Disponible** con lista desplegable Sí/No).
2. Un Worker propio del catálogo lee la Base y guarda la respuesta unos minutos en caché, para que muchas visitas desde Instagram no saturen a Google (la API de Sheets tiene límites por minuto). Alternativa más simple: un `productos.json` que se regenera.
3. **Panel de administración dentro del catálogo**, con contraseña: lista solo los productos con Disponible = Sí, buscador por nombre/SKU, vista de la foto actual y botón para subir o cambiar la foto.
4. Al subir, el navegador **reduce y comprime** la imagen (~1200 px) y el Worker la guarda en R2 con la misma convención de nombres de la app de captura. **No hace falta escribir en el Sheet**: la URL de la foto se deduce del SKU. Se descartó la opción de escribir en el Sheet con cuenta de servicio de Google (clave frágil, más mantenimiento).
5. El catálogo público muestra los productos disponibles.
6. **[DECIDIDO]** Reutilizar el bucket existente `catalogo-fotos-prod` en vez de crear otro R2. El Worker del catálogo se conectaría a ese bucket por binding, sin tocar la app de captura.

Columnas sugeridas para agregar a la Base (idealmente en una pestaña nueva `Catalogo_Web` con encabezados en la fila 1, alimentada con fórmulas desde la principal):
`Foto URL` (o se deduce del SKU), `Visible`/`Disponible` (Sí/No), `Precio catálogo` (numérico, uno solo), `Categoría catálogo`, `Descripción`, y opcionales `Orden` y `Nuevo`.

Notas técnicas:
- Las fotos se sirven mejor con caché largo y desde un dominio propio de R2 o desde el Worker del catálogo (la app de captura las sirve con caché de solo 60 s).
- El panel no quita fondos ni recorta; solo reduce y comprime.
- Antes de implementar el panel, mostrar 2–3 alternativas de diseño (regla del proyecto).
- Planes gratuitos de Workers/R2/Pages deberían alcanzar; revisar límites vigentes en el panel de Cloudflare.

## 7. Cloudflare Pages: por qué no se actualiza

- **[VERIFICADO]** En la cuenta de Cloudflare, el proyecto `catalogo-supremenails` figura con **Git Provider = No**: **no está conectado a GitHub**. Por eso un push nunca lo actualiza. Los despliegues anteriores que "funcionaban" probablemente fueron subidas directas (inferencia: sin Git conectado no hay otra vía automática); no se revisó el historial de despliegues.
- Soluciones: (1) subida directa con `wrangler pages deploy` (inmediata, se repite en cada cambio); (2) **conectar el proyecto a GitHub desde el panel de Cloudflare** (lo hace el dueño con un clic de autorización; luego se actualiza solo). La segunda es la adecuada para entregar al cliente.
- **[PENDIENTE]** Se ofreció subir la versión actual por subida directa; no se ha hecho.

## 8. Decisiones abiertas (pendientes del dueño)

1. **¿Cuál precio es el público?** (Precio de venta 1 o 2.)
2. **¿Dónde vive la disponibilidad?** Columna Sí/No en la Base (lo que pidió el dueño) o el archivo de R2 de la app de captura. Hay que elegir una sola fuente.
3. ¿El catálogo público muestra **solo productos con foto**, o también los disponibles sin foto (con imagen provisional)? Pregunta pendiente desde antes: ¿"tiene foto" significa la columna Sí/No o que la foto exista realmente en R2?
4. **Autorización** para que el catálogo use el bucket de producción (se propuso empezar solo leyendo).
5. Confirmar la **dirección pública** de las fotos (dominio público del bucket o ruta por Worker).
6. Cuál proyecto de Cloudflare Pages es el oficial (ver sección 2).
7. Entrega al cliente: que tenga su propia cuenta de Cloudflare y de GitHub (transferir el repo, dejar Worker/R2/Pages bajo su cuenta, guía de una página con cambiar contraseña, agregar un producto y qué hacer si algo falla).

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
3. Resolver primero las **decisiones abiertas** (sección 8, puntos 1–3 y 5), porque bloquean el diseño del panel y de la lectura del Sheet.
4. Conectar Cloudflare Pages a GitHub (sección 7) o hacer subida directa.
5. Recomendado: crear una pestaña `Catalogo_Web` limpia en la Base antes de programar la lectura.
6. Después: Worker del catálogo (lectura del Sheet + lectura de fotos del bucket), luego panel de subida con contraseña, prueba en celular real, guía y entrega al cliente.

## 12. Historial resumido del trabajo previo

- Se reconstruyó el catálogo como sitio guiado por datos a partir de una importación real de productos.
- Se corrigieron múltiples problemas de layout (brechas de precio, tamaños de foto, desbordes de título, alineación del buscador, tamaño de foto en el modal, panel de favoritos, el atributo `[hidden]` que perdía contra `display`). Detalle en `NOTAS_CORRECCIONES.md`.
- Un intento de sincronizar con GitHub chocó con cambios locales; el dueño ordenó descartar lo local y trabajar solo con GitHub.
- Se activó GitHub Pages como enlace público mientras se diagnosticaba Cloudflare.
