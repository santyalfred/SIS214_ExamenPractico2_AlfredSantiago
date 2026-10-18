/* =============================================================================
   tema_inicial.js — Lee el tema guardado y lo aplica antes de que la página se dibuje, para que no parpadee en blanco si usas modo oscuro. 
   No depende de ningún otro archivo y la clave debe coincidir con CLAVE_PREFERENCIAS de js/modulos/almacenamiento.js.
   ============================================================================= */
(() => {
  const CLAVE_PREFERENCIAS = 'cv_santiago_preferencias';
  const sistema_prefiere_oscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let tema = sistema_prefiere_oscuro ? 'oscuro' : 'claro';

  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_PREFERENCIAS));
    if (guardado && (guardado.tema === 'oscuro' || guardado.tema === 'claro')) {
      tema = guardado.tema;
    }
  } catch (error) {
    /* Valor corrupto o localStorage bloqueado: se mantiene la preferencia del sistema. */
  }

  document.documentElement.dataset.tema = tema;
})();