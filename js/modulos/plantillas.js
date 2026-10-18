/* =============================================================================
   plantillas.js — Son funciones que construyen fragmentos del DOM a partir de datos.
   Solo se usan elementos semánticos (sin <div>): li, article, figure, dl, etc.
   ============================================================================= */
import { crear, formatear, texto_enriquecido } from './utilidades.js';

const crear_tiempo = (fecha) =>
  crear('time', { atributos: { datetime: fecha.iso }, texto: fecha.texto });

const formato_fecha = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric' });

/*  Cabecera */

export const crear_item_navegacion = (item) =>
  crear('li', {}, crear('a', { atributos: { href: `#${item.id}` }, texto: item.etiqueta }));

export const crear_accion = (accion) =>
  crear('li', {}, crear('a', {
    clase: `boton boton_${accion.tipo}`,
    atributos: { href: accion.href },
    texto: accion.etiqueta
  }));

export const crear_dato_contacto = (dato) => [
  crear('dt', { texto: dato.etiqueta }),
  crear('dd', {}, dato.href
    ? crear('a', { atributos: { href: dato.href }, texto: dato.valor })
    : dato.valor)
];

export const crear_estadistica = (valor, etiqueta) =>
  crear('li', {}, crear('strong', { texto: String(valor) }), crear('span', { texto: etiqueta }));

export const crear_item_marquesina = (nombre, es_copia) =>
  crear('li', { dataset: es_copia ? { copia: 'true' } : {}, texto: nombre });

export const crear_enlace_profesional = (enlace) =>
  crear('li', {}, crear('a', {
    atributos: { href: enlace.href, target: '_blank', rel: 'noopener noreferrer' }
  }, crear('strong', { texto: enlace.etiqueta }), crear('span', { texto: enlace.detalle })));

/* Línea de tiempo */

export const crear_hito_formacion = (formacion) =>
  crear('li', { clase: 'hito' },
    crear('article', { clase: 'hito_contenido' },
      crear('p', { clase: 'hito_periodo' },
        crear_tiempo(formacion.desde),
        ' — ',
        formacion.hasta.iso ? crear_tiempo(formacion.hasta) : formacion.hasta.texto),
      crear('h3', { texto: formacion.titulo }),
      crear('p', { clase: 'hito_lugar', texto: formacion.institucion }),
      crear('dl', { clase: 'hito_detalles' },
        ...formacion.detalles.flatMap((detalle) => [
          crear('dt', { texto: detalle.etiqueta }),
          crear('dd', {}, detalle.iso
            ? crear_tiempo({ iso: detalle.iso, texto: detalle.valor })
            : detalle.valor)
        ]))));

export const crear_hito_experiencia = (proyecto, textos) =>
  crear('li', { clase: 'hito' },
    crear('article', { clase: 'hito_contenido' },
      crear('p', { clase: 'hito_periodo' }, `${proyecto.periodo.etiqueta} · `, crear_tiempo(proyecto.periodo)),
      crear('h3', { texto: `${proyecto.rol} — ${proyecto.nombre}` }),
      crear('p', { clase: 'hito_lugar', texto: proyecto.institucion }),
      crear('p', {}, crear('strong', { texto: `${textos.descripcion}: ` }),
        texto_enriquecido(proyecto.descripcion_experiencia)),
      crear('p', {}, crear('strong', { texto: `${textos.logro}: ` }), proyecto.logro)));

/* Portafolio  */

export const crear_tarjeta_proyecto = (proyecto, textos) =>
  crear('li', {},
    crear('article', { clase: 'tarjeta_proyecto' },
      crear('figure', { clase: 'tarjeta_figura' },
        crear('img', {
          atributos: { src: proyecto.imagen.src, alt: proyecto.imagen.alt, loading: 'lazy', decoding: 'async' }
        }),
        crear('figcaption', { texto: proyecto.imagen.pie })),
      crear('p', { clase: 'hito_periodo' }, crear_tiempo(proyecto.periodo)),
      crear('h3', { texto: proyecto.nombre }),
      crear('p', { texto: proyecto.resumen }),
      crear('ul', { clase: 'chips', atributos: { role: 'list', 'aria-label': textos.tecnologias } },
        ...proyecto.tecnologias.map((tecnologia) => crear('li', { texto: tecnologia }))),
      crear('dl', { clase: 'ficha' },
        crear('dt', { texto: textos.rol }),
        crear('dd', { texto: proyecto.rol }),
        crear('dt', { texto: textos.resultado }),
        crear('dd', { texto: proyecto.resultado }))));

const crear_habilidad = (habilidad, textos) => {
  const tiene_nivel = typeof habilidad.nivel === 'number';

  return crear('li', { clase: 'habilidad' },
    crear('span', { clase: 'habilidad_nombre' },
      habilidad.nombre,
      habilidad.nota ? crear('small', { clase: 'habilidad_nota', texto: habilidad.nota }) : null),
    tiene_nivel ? crear('span', { clase: 'habilidad_valor', texto: `${habilidad.nivel}/10` }) : null,
    tiene_nivel
      ? crear('meter', {
        texto: `${habilidad.nivel}/10`,
        atributos: {
          min: 0, max: 10, low: 3, high: 7, optimum: 10, value: habilidad.nivel,
          'aria-label': formatear(textos.nivel_aria, { nombre: habilidad.nombre, nivel: habilidad.nivel })
        }
      })
      : null);
};

export const crear_grupo_habilidades = (categoria, items, textos) =>
  crear('li', {},
    crear('article', { clase: 'grupo_habilidades' },
      crear('h3', { texto: categoria.titulo }),
      crear('ul', { clase: 'lista_habilidades', atributos: { role: 'list' } },
        ...items.map((habilidad) => crear_habilidad(habilidad, textos)))));

export const crear_item_certificacion = (certificacion) =>
  crear('li', {},
    crear('article', { clase: 'certificacion' },
      crear('p', { clase: 'certificacion_tipo', texto: certificacion.tipo }),
      crear('h3', { texto: certificacion.nombre }),
      crear('p', {}, crear_tiempo(certificacion.fecha))));

/* Idiomas  */

const DESTREZAS = ['lectura', 'escritura', 'conversacion'];

export const crear_fila_idioma = (idioma, textos) =>
  crear('tr', {},
    crear('th', { atributos: { scope: 'row' }, texto: idioma.idioma }),
    ...DESTREZAS.map((destreza, indice) =>
      crear('td', {},
        crear('meter', {
          texto: `${idioma[destreza]}/10`,
          atributos: {
            min: 0, max: 10, low: 3, high: 7, optimum: 10, value: idioma[destreza],
            'aria-label': formatear(textos.nivel_aria, {
              idioma: idioma.idioma,
              destreza: textos.columnas[indice + 1],
              nivel: idioma[destreza]
            })
          }
        }),
        crear('span', { texto: `${idioma[destreza]}/10` }))));

/*  GitHub */

export const crear_esqueleto_repo = () =>
  crear('li', { clase: 'esqueleto', atributos: { 'aria-hidden': 'true' } });

export const crear_tarjeta_repo = (repo, textos) =>
  crear('li', {},
    crear('article', { clase: 'tarjeta_repo' },
      crear('h3', {}, crear('a', {
        atributos: { href: repo.html_url, target: '_blank', rel: 'noopener noreferrer' },
        texto: repo.name
      })),
      crear('p', { texto: repo.description ?? textos.sin_descripcion }),
      crear('dl', { clase: 'ficha' },
        crear('dt', { texto: textos.etiquetas.lenguaje }),
        crear('dd', { texto: repo.language ?? '—' }),
        crear('dt', { texto: textos.etiquetas.estrellas }),
        crear('dd', { texto: String(repo.stargazers_count) }),
        crear('dt', { texto: textos.etiquetas.actualizado }),
        crear('dd', {}, crear('time', {
          atributos: { datetime: repo.pushed_at },
          texto: formato_fecha.format(new Date(repo.pushed_at))
        })))));

/** Devuelve los nodos que componen la ficha del perfil de GitHub. */
export const crear_contenido_perfil_github = (perfil, textos, usuario) => [
  crear('img', {
    clase: 'avatar_github',
    atributos: { src: perfil.avatar_url, alt: formatear(textos.avatar_alt, { usuario }), width: 96, height: 96 }
  }),
  crear('h3', { texto: perfil.name ?? perfil.login }),
  perfil.bio ? crear('p', { texto: perfil.bio }) : null,
  crear('dl', { clase: 'ficha' },
    crear('dt', { texto: textos.etiquetas.repos }),
    crear('dd', { texto: String(perfil.public_repos) }),
    crear('dt', { texto: textos.etiquetas.seguidores }),
    crear('dd', { texto: String(perfil.followers) })),
  crear('a', {
    clase: 'boton boton_secundario',
    atributos: { href: perfil.html_url, target: '_blank', rel: 'noopener noreferrer' },
    texto: textos.etiquetas.ver_perfil
  })
];
