/* =============================================================================
   Menú hamburguesa responsivo (móvil y tablet) para capturar eventos click 
   para conmutar la clase CSS que controla la visibilidad
   del menú y muta dinámicamente aria-expanded (true/false).
   ============================================================================= */

const ANCHO_ESCRITORIO = '(min-width: 1025px)';

export function iniciar_menu() {
  const boton = document.getElementById('boton_menu');
  const navegacion = document.getElementById('navegacion_principal');
  const cabecera = document.getElementById('inicio_pagina');
  const es_escritorio = window.matchMedia(ANCHO_ESCRITORIO);

  const esta_abierto = () => boton.getAttribute('aria-expanded') === 'true';

  const establecer = (abierto) => {
    navegacion.classList.toggle('abierta', abierto);
    boton.setAttribute('aria-expanded', String(abierto));
  };

  boton.addEventListener('click', () => establecer(!esta_abierto()));

  /* Delegación de eventos: un solo listener para todos los enlaces del menú. */
  navegacion.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) establecer(false);
  });

  /* Clic fuera de la cabecera → cerrar. */
  document.addEventListener('click', (evento) => {
    if (esta_abierto() && !cabecera.contains(evento.target)) establecer(false);
  });

  /* Escape → cerrar y devolver el foco al botón (accesibilidad por teclado). */
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && esta_abierto()) {
      establecer(false);
      boton.focus();
    }
  });

  /* Al pasar a escritorio el menú es horizontal: se reinicia el estado. */
  es_escritorio.addEventListener('change', (evento) => {
    if (evento.matches) establecer(false);
  });
}
