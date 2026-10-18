/* =============================================================================
   utilidades.js — Funciones puras y ayudantes de DOM reutilizables.
   ============================================================================= */

/** Obtiene un valor anidado a partir de una ruta tipo "secciones.perfil.titulo". */
export const obtener_ruta = (objeto, ruta) =>
  ruta.split('.').reduce((actual, clave) => actual?.[clave], objeto);

/** Reemplaza marcadores de una plantilla por sus valores. */
export const formatear = (plantilla, valores = {}) =>
  plantilla.replace(/\{(\w+)\}/g, (coincidencia, clave) => String(valores[clave] ?? coincidencia));

/** Minúsculas y sin tildes: "Análisis" → "analisis". Sirve para buscar sin fricción. */
export const normalizar = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

/** Garantiza la inmutabilidad de los datos originales. */
export function congelar_profundo(valor) {
  if (valor && typeof valor === 'object' && !Object.isFrozen(valor)) {
    Object.values(valor).forEach(congelar_profundo);
    Object.freeze(valor);
  }
  return valor;
}

/**
 * Crea un elemento del DOM de forma declarativa
 */
export function crear(etiqueta, opciones = {}, ...hijos) {
  const elemento = document.createElement(etiqueta);
  const { clase, texto, atributos = {}, dataset = {} } = opciones;

  if (clase) elemento.className = clase;
  if (texto !== undefined) elemento.textContent = texto;

  Object.entries(atributos).forEach(([nombre, valor]) => {
    if (valor !== undefined && valor !== null) elemento.setAttribute(nombre, valor);
  });
  Object.entries(dataset).forEach(([clave, valor]) => {
    elemento.dataset[clave] = valor;
  });

  hijos.flat().filter((hijo) => hijo !== null && hijo !== undefined && hijo !== false)
    .forEach((hijo) => elemento.append(hijo));

  return elemento;
}

/**
 * Convierte un mini-formato en nodos seguros:  **negrita**  *cursiva*  ==resaltado==
 * Devuelve un DocumentFragment (nunca interpreta HTML).
 */
export function texto_enriquecido(texto) {
  const fragmento = document.createDocumentFragment();
  const patron = /(\*\*[^*]+\*\*|==[^=]+==|\*[^*]+\*)/;

  texto.split(patron).forEach((trozo) => {
    if (!trozo) return;
    if (trozo.startsWith('**')) fragmento.append(crear('strong', { texto: trozo.slice(2, -2) }));
    else if (trozo.startsWith('==')) fragmento.append(crear('mark', { texto: trozo.slice(2, -2) }));
    else if (trozo.startsWith('*')) fragmento.append(crear('em', { texto: trozo.slice(1, -1) }));
    else fragmento.append(trozo);
  });

  return fragmento;
}

/** "Santiago Alfred Michovich" → "SAM" */
export const obtener_iniciales = (nombre) =>
  nombre.split(/\s+/).map((parte) => parte[0]).join('').toUpperCase();

/** "Santiago Alfred Michovich" → "Santiago Michovich" */
export function nombre_corto(nombre) {
  const partes = nombre.split(/\s+/);
  return partes.length > 2 ? `${partes[0]} ${partes[partes.length - 1]}` : nombre;
}
