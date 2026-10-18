/* =============================================================================
   Tema (claro / oscuro)
   Muta el atributo data-tema del elemento <html> y persiste la preferencia en
   localStorage serializándola con el JSON.
   ============================================================================= */
import { CLAVE_PREFERENCIAS, leer_json, guardar_json } from './almacenamiento.js';

export function iniciar_tema(datos) {
  const raiz = document.documentElement;
  const boton = document.getElementById('boton_tema');
  const icono = document.getElementById('icono_tema');
  icono.textContent = datos.textos.tema.icono;

  const aplicar_tema = (tema) => {
    const es_oscuro = tema === 'oscuro';
    raiz.dataset.tema = tema;
    boton.setAttribute('aria-pressed', String(es_oscuro));
  };

  /* tema_inicial.js ya dejó data-tema restaurado; aquí solo se sincroniza la interfaz. */
  aplicar_tema(raiz.dataset.tema === 'oscuro' ? 'oscuro' : 'claro');

  boton.addEventListener('click', () => {
    const nuevo_tema = raiz.dataset.tema === 'oscuro' ? 'claro' : 'oscuro';
    aplicar_tema(nuevo_tema);
    guardar_json(CLAVE_PREFERENCIAS, { ...leer_json(CLAVE_PREFERENCIAS, {}), tema: nuevo_tema });
  });
}

