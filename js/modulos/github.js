/* =============================================================================
   Módulo asíncrono: consumo de la API REST pública de GitHub
   - Evalúa response.ok y gestiona explícitamente los errores 200, 400, 403, 404 y 500.
   - Refleja tres estados en la interfaz: loading, success y error.
   ============================================================================= */
import { formatear } from './utilidades.js';
import {
  crear_tarjeta_repo, crear_esqueleto_repo, crear_contenido_perfil_github
} from './plantillas.js';

const URL_API = 'https://api.github.com';

class ErrorApi extends Error {
  constructor(estado, mensaje) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.estado = estado;
  }
}

function mensaje_por_estado(estado, errores) {
  switch (estado) {
    case 400: return errores.e400;
    case 403: return errores.e403;
    case 404: return errores.e404;
    case 500: return errores.e500;
    default:
      return estado >= 500 ? errores.e500 : formatear(errores.generico, { estado });
  }
}

async function pedir_json(url, errores, signal) {
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' }, signal });

  if (!response.ok) {
    throw new ErrorApi(response.status, mensaje_por_estado(response.status, errores));
  }

  return response.json(); // 200 OK
}

function mensaje_de_error(error, errores) {
  if (error instanceof ErrorApi) return error.message;
  if (error.name === 'AbortError') return errores.tiempo_agotado;
  if (error instanceof TypeError) return errores.sin_conexion; // fallo de red
  return formatear(errores.generico, { estado: '—' });
}

export function iniciar_github(datos) {
  const { usuario, max_repos, tiempo_maximo_ms } = datos.github;
  const textos = datos.secciones.github;

  const seccion = document.getElementById('github');
  const estado = document.getElementById('estado_github');
  const perfil = document.getElementById('perfil_github');
  const lista = document.getElementById('lista_repos');
  const boton_reintentar = document.getElementById('boton_reintentar');

  const establecer_estado = (nombre, mensaje) => {
    seccion.dataset.estado = nombre; // cargando | exito | error
    seccion.setAttribute('aria-busy', String(nombre === 'cargando'));
    estado.textContent = mensaje;
    boton_reintentar.hidden = nombre !== 'error';
  };

  async function cargar() {
    establecer_estado('cargando', textos.cargando);
    perfil.hidden = true;
    perfil.replaceChildren();
    lista.replaceChildren(...Array.from({ length: 3 }, () => crear_esqueleto_repo()));

    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), tiempo_maximo_ms);
    const base = `${URL_API}/users/${encodeURIComponent(usuario)}`;

    try {
      const [datos_perfil, repos] = await Promise.all([
        pedir_json(base, textos.errores, controlador.signal),
        pedir_json(`${base}/repos?sort=updated&per_page=${max_repos}`, textos.errores, controlador.signal)
      ]);

      perfil.replaceChildren(...crear_contenido_perfil_github(datos_perfil, textos, usuario));
      perfil.hidden = false;
      lista.replaceChildren(...repos.map((repo) => crear_tarjeta_repo(repo, textos)));

      establecer_estado('exito', repos.length > 0
        ? formatear(textos.exito, { n: repos.length, usuario })
        : textos.sin_repos);
    } catch (error) {
      console.warn('[github] Petición fallida (manejada en la interfaz):', error);
      lista.replaceChildren();
      establecer_estado('error', mensaje_de_error(error, textos.errores));
    } finally {
      clearTimeout(temporizador);
    }
  }

  boton_reintentar.addEventListener('click', cargar);
  cargar();
}
