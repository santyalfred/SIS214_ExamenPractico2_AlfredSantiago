/* =============================================================================
   almacenamiento.js — Persistencia en localStorage con serialización JSON.
   ============================================================================= */

export const CLAVE_PREFERENCIAS = 'cv_santiago_preferencias';

/** Lee y deserializa (JSON.parse) un valor; si falla devuelve el valor por defecto. */
export function leer_json(clave, valor_por_defecto = null) {
  try {
    const crudo = localStorage.getItem(clave);
    return crudo === null ? valor_por_defecto : JSON.parse(crudo);
  } catch (error) {
    console.warn(`[almacenamiento] No se pudo leer "${clave}":`, error);
    return valor_por_defecto;
  }
}

/** Serializa (JSON.stringify) y guarda un valor. Devuelve true si tuvo éxito. */
export function guardar_json(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch (error) {
    console.warn(`[almacenamiento] No se pudo guardar "${clave}":`, error);
    return false;
  }
}