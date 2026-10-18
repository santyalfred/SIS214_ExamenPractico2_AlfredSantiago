/* =============================================================================
   render.js — Pinta en el DOM todo el contenido que viene de data/datos.json.
   Enlaces declarativos, listas y bloques construidos con las plantillas.
   ============================================================================= */
import { obtener_ruta, crear, texto_enriquecido, obtener_iniciales, nombre_corto } from './utilidades.js';
import {
  crear_item_navegacion, crear_accion, crear_dato_contacto, crear_estadistica,
  crear_item_marquesina, crear_enlace_profesional, crear_hito_formacion,
  crear_hito_experiencia, crear_fila_idioma
} from './plantillas.js';

const por_id = (id) => document.getElementById(id);
const rellenar = (id, nodos) => por_id(id).replaceChildren(...nodos);

function enlazar_textos(datos) {
  document.querySelectorAll('[data-texto]').forEach((nodo) => {
    const valor = obtener_ruta(datos, nodo.dataset.texto);
    if (valor === undefined) {
      console.warn(`[render] No hay dato para "${nodo.dataset.texto}".`);
      return;
    }
    nodo.textContent = valor;
  });
}

function enlazar_atributos(datos) {
  document.querySelectorAll('[data-attr]').forEach((nodo) => {
    nodo.dataset.attr.split(';').forEach((par) => {
      const [atributo, ruta] = par.split(':').map((parte) => parte.trim());
      const valor = obtener_ruta(datos, ruta);
      if (valor === undefined) {
        console.warn(`[render] No hay dato para "${ruta}".`);
        return;
      }
      nodo.setAttribute(atributo, valor);
    });
  });
}

function renderizar_marca(persona) {
  por_id('marca_sigla').textContent = obtener_iniciales(persona.nombre);
  por_id('marca_nombre').textContent = nombre_corto(persona.nombre);
}

function renderizar_hero(datos) {
  const { persona, habilidades, proyectos, certificaciones, idiomas, textos } = datos;

  rellenar('lista_acciones', persona.acciones.map(crear_accion));
  rellenar('datos_hero', persona.contactos.flatMap(crear_dato_contacto));

  /* Estadísticas calculadas a partir de los datos (no escritas a mano). */
  const conteos = {
    proyectos: proyectos.length,
    habilidades: habilidades.items.length,
    certificaciones: certificaciones.length,
    idiomas: idiomas.length
  };
  rellenar('lista_estadisticas', Object.entries(conteos)
    .map(([clave, total]) => crear_estadistica(total, textos.estadisticas[clave])));

  /* Cinta de tecnologías: dos mitades idénticas para un bucle continuo sin saltos. */
  const categorias_visibles = new Set(habilidades.categorias.filter((c) => c.marquesina).map((c) => c.id));
  const nombres = habilidades.items.filter((h) => categorias_visibles.has(h.categoria)).map((h) => h.nombre);
  const mitad = (es_copia) => [...nombres, ...nombres].map((nombre) => crear_item_marquesina(nombre, es_copia));
  rellenar('lista_marquesina', [...mitad(false), ...mitad(true)]);
}

function renderizar_perfil({ perfil }) {
  rellenar('perfil_parrafos', perfil.parrafos.map((parrafo) => crear('p', {}, texto_enriquecido(parrafo))));
  rellenar('lista_fortalezas', perfil.fortalezas.map((fortaleza) => crear('li', { texto: fortaleza })));
  por_id('perfil_objetivo').replaceChildren(texto_enriquecido(perfil.objetivo));
}

function renderizar_idiomas({ idiomas, secciones }) {
  rellenar('cabecera_idiomas', secciones.idiomas.columnas
    .map((columna) => crear('th', { atributos: { scope: 'col' }, texto: columna })));
  rellenar('cuerpo_idiomas', idiomas.map((idioma) => crear_fila_idioma(idioma, secciones.idiomas)));
}

function renderizar_multimedia({ multimedia, secciones }) {
  const montar = (id, medio, mensaje_sin_soporte) =>
    por_id(id).replaceChildren(
      crear('source', { atributos: { src: medio.src, type: medio.tipo } }),
      mensaje_sin_soporte);

  montar('reproductor_audio', multimedia.audio, secciones.multimedia.sin_audio);
  montar('reproductor_video', multimedia.video, secciones.multimedia.sin_video);
}

function renderizar_formulario({ formulario }) {
  rellenar('motivo', [
    crear('option', { atributos: { value: '' }, texto: formulario.seleccion_placeholder }),
    ...formulario.motivos.map((motivo) =>
      crear('option', { atributos: { value: motivo.valor }, texto: motivo.etiqueta }))
  ]);
}

export function renderizar_pagina(datos) {
  document.title = datos.meta.titulo;
  document.querySelector('meta[name="description"]').setAttribute('content', datos.meta.descripcion);

  enlazar_textos(datos);
  enlazar_atributos(datos);

  renderizar_marca(datos.persona);
  rellenar('lista_navegacion', datos.navegacion.map(crear_item_navegacion));
  renderizar_hero(datos);
  renderizar_perfil(datos);
  rellenar('lista_formacion', datos.formacion.map(crear_hito_formacion));
  rellenar('lista_experiencia', datos.proyectos
    .map((proyecto) => crear_hito_experiencia(proyecto, datos.secciones.experiencia)));
  renderizar_idiomas(datos);
  renderizar_multimedia(datos);
  renderizar_formulario(datos);

  rellenar('datos_contacto', datos.persona.contactos.flatMap(crear_dato_contacto));
  rellenar('datos_pie', datos.persona.contactos.flatMap(crear_dato_contacto));
  rellenar('lista_enlaces', datos.persona.enlaces.map(crear_enlace_profesional));
}
