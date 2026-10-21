// Cloudflare Pages Function: GET /api/ciudad
// Devuelve la ciudad aproximada de quien visita, según su conexión (la calcula Cloudflare en el borde de la red).
// No usa claves ni servicios de terceros, no guarda nada y la respuesta nunca se almacena en caché.
// El catálogo solo la usa como SUGERENCIA para el campo «Ciudad» del pedido; la persona puede cambiarla.
// Nota: por IP la precisión es limitada (a veces indica la ciudad principal del proveedor de internet).
export function onRequestGet({ request }) {
  const cf = request.cf || {};
  return Response.json(
    { city: cf.city || '', region: cf.region || '', country: cf.country || '' },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
