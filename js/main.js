/* =============================================================================
   main.js — Es el punto de entrada y el único módulo que carga el HTML. 
   Carga datos.json, lo congela y activa todos los módulos en orden.
   ============================================================================= */
import { cargar_datos } from './modulos/datos.js';
import { congelar_profundo } from './modulos/utilidades.js';
import { renderizar_pagina } from './modulos/render.js';
import { iniciar_tema } from './modulos/tema.js';
import { iniciar_menu } from './modulos/menu.js';
import { iniciar_filtro } from './modulos/filtro.js';
import { iniciar_formulario } from './modulos/formulario.js';
import { iniciar_github } from './modulos/github.js';

const RUTA_DATOS = 'data/datos.JSON';

/* Único texto fijo de la aplicación: si el JSON no carga, no hay de dónde leer mensajes. */
const MENSAJE_FALLO_DATOS =
  'No se pudieron cargar los datos del CV (data/datos.json). Si abriste index.html con doble clic, '
  + 'ábrelo con la extensión Live Server de VS Code o desde la URL publicada en GitHub Pages.';

function mostrar_error_global(error) {
  console.error('[main] Error al iniciar la aplicación:', error);
  const aviso = document.getElementById('aviso_global');
  aviso.textContent = MENSAJE_FALLO_DATOS;
  aviso.hidden = false;
}

async function iniciar() {
  iniciar_menu(); // no depende de los datos: funciona aunque el JSON falle

  try {
    const datos = congelar_profundo(await cargar_datos(RUTA_DATOS));

    renderizar_pagina(datos);
    iniciar_tema(datos);
    iniciar_filtro(datos);
    iniciar_formulario(datos);
    iniciar_github(datos);
  } catch (error) {
    mostrar_error_global(error);
  }
}

iniciar();