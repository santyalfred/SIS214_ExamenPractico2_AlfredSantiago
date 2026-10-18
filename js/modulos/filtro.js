/* =============================================================================
   Buscador dinámico en tiempo real
   Filtra proyectos, habilidades y certificaciones mientras se escribe.
   Los datos originales están congelados y cada búsqueda crea colecciones 
   NUEVAS con .filter() encadenado a .map().
   ============================================================================= */
import { normalizar, formatear } from './utilidades.js';
import {
  crear_tarjeta_proyecto, crear_grupo_habilidades, crear_item_certificacion
} from './plantillas.js';

export function iniciar_filtro(datos) {
  const { secciones } = datos;
  const formulario = document.getElementById('form_buscador');
  const campo = document.getElementById('campo_busqueda');
  const boton_limpiar = document.getElementById('boton_limpiar_busqueda');
  const estado = document.getElementById('estado_busqueda');

  const lista_proyectos = document.getElementById('lista_proyectos');
  const lista_habilidades = document.getElementById('lista_habilidades');
  const lista_certificaciones = document.getElementById('lista_certificaciones');
  const vacio_proyectos = document.getElementById('vacio_proyectos');
  const vacio_habilidades = document.getElementById('vacio_habilidades');
  const vacio_certificaciones = document.getElementById('vacio_certificaciones');

  /** true si TODAS las palabras de la consulta aparecen en alguno de los campos. */
  const coincide = (consulta, campos_de_texto) => {
    if (consulta === '') return true;
    const pajar = normalizar(campos_de_texto.flat().filter(Boolean).join(' '));
    return consulta.split(/\s+/).every((termino) => pajar.includes(termino));
  };

  const aplicar_filtro = (texto_crudo) => {
    const consulta = normalizar(texto_crudo);

    const proyectos = datos.proyectos
      .filter((p) => coincide(consulta, [p.nombre, p.resumen, p.tecnologias, p.rol, p.resultado]));

    const habilidades = datos.habilidades.items
      .filter((h) => coincide(consulta, [h.nombre, h.nota, h.categoria]));

    const certificaciones = datos.certificaciones
      .filter((c) => coincide(consulta, [c.nombre, c.tipo, c.fecha.texto]));

    lista_proyectos.replaceChildren(...proyectos
      .map((proyecto) => crear_tarjeta_proyecto(proyecto, secciones.proyectos)));

    lista_habilidades.replaceChildren(...datos.habilidades.categorias
      .map((categoria) => ({ categoria, items: habilidades.filter((h) => h.categoria === categoria.id) }))
      .filter(({ items }) => items.length > 0)
      .map(({ categoria, items }) => crear_grupo_habilidades(categoria, items, secciones.habilidades)));

    lista_certificaciones.replaceChildren(...certificaciones
      .map((certificacion) => crear_item_certificacion(certificacion)));

    vacio_proyectos.hidden = proyectos.length > 0;
    vacio_habilidades.hidden = habilidades.length > 0;
    vacio_certificaciones.hidden = certificaciones.length > 0;

    /* Mensaje accesible (aria-live) con el número de resultados. */
    const total = proyectos.length + habilidades.length + certificaciones.length;
    const plantillas = secciones.explorar.estado;
    const consulta_visible = texto_crudo.trim();
    let mensaje;
    if (consulta === '') mensaje = formatear(plantillas.todos, { n: total });
    else if (total === 0) mensaje = formatear(plantillas.ninguno, { q: consulta_visible });
    else if (total === 1) mensaje = formatear(plantillas.uno, { q: consulta_visible });
    else mensaje = formatear(plantillas.otros, { n: total, q: consulta_visible });
    estado.textContent = mensaje;
  };

  campo.addEventListener('input', () => aplicar_filtro(campo.value));

  boton_limpiar.addEventListener('click', () => {
    campo.value = '';
    aplicar_filtro('');
    campo.focus();
  });

  /* Enter dentro del buscador no debe recargar la página. */
  formulario.addEventListener('submit', (evento) => evento.preventDefault());

  aplicar_filtro('');
}
