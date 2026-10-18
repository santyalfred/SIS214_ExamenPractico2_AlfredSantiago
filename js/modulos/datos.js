/* =============================================================================
   datos.js — Carga del contenido del CV desde un archivo JSON.
   Ningún dato personal está escrito en el HTML ni en el JS: todo sale de aquí.
   ============================================================================= */

export async function cargar_datos(ruta) {
  const response = await fetch(ruta, { headers: { Accept: 'application/json' } });

  if (!response.ok) {
    throw new Error(`No se pudo cargar "${ruta}" (HTTP ${response.status}).`);
  }

  return response.json();
}