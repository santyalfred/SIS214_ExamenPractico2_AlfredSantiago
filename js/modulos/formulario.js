/* =============================================================================
   Formulario de contacto interactivo:
   - Valida en tiempo real con el evento input y muestra estados de error/éxito.
   ============================================================================= */
import { formatear } from './utilidades.js';

export function iniciar_formulario(datos) {
  const textos = datos.formulario;
  const formulario = document.getElementById('form_contacto');
  const estado = document.getElementById('estado_formulario');
  const boton_enviar = formulario.querySelector('[type="submit"]');
  const area_mensaje = document.getElementById('mensaje');
  const contador = document.getElementById('contador_mensaje');
  const campos = [...formulario.querySelectorAll('[data-campo]')];

  const tiene_valor = (campo) => (campo.type === 'checkbox' ? campo.checked : campo.value.trim() !== '');

  /** Regla extra: un texto compuesto solo por espacios NO cuenta como válido. */
  const aplicar_reglas_extra = (campo) => {
    campo.setCustomValidity('');
    const es_texto = campo.type === 'text' || campo.tagName === 'TEXTAREA';
    if (!es_texto) return;

    const largo = campo.value.trim().length;
    if (campo.required && largo === 0) {
      campo.setCustomValidity(textos.validacion.obligatorio);
    } else if (largo > 0 && largo < campo.minLength) {
      campo.setCustomValidity(formatear(textos.validacion.corto, { min: campo.minLength }));
    }
  };

  const mensaje_de_error = (campo) => {
    const { validity } = campo;
    if (validity.customError) return campo.validationMessage;
    if (validity.valueMissing) {
      return campo.type === 'checkbox' ? textos.validacion.marcar : textos.validacion.obligatorio;
    }
    if (validity.typeMismatch || validity.patternMismatch) {
      return textos.validacion[`${campo.name}_formato`] ?? campo.validationMessage;
    }
    if (validity.tooShort) return formatear(textos.validacion.corto, { min: campo.minLength });
    if (validity.tooLong) return formatear(textos.validacion.largo, { max: campo.maxLength });
    return campo.validationMessage;
  };

  /** Valida un campo y refleja el resultado en la interfaz. Devuelve true/false. */
  const validar_campo = (campo) => {
    aplicar_reglas_extra(campo);
    const es_valido = campo.checkValidity();
    const con_valor = tiene_valor(campo);
    const salida = document.getElementById(`error_${campo.name}`);

    campo.closest('.campo').dataset.estado = !es_valido ? 'error' : (con_valor ? 'valido' : 'neutro');
    campo.setAttribute('aria-invalid', String(!es_valido));

    if (!es_valido) salida.textContent = mensaje_de_error(campo);
    else salida.textContent = con_valor ? textos.validacion.valido : '';

    return es_valido;
  };

  const actualizar_contador = () => {
    contador.textContent = `${area_mensaje.value.length}/${area_mensaje.maxLength}`;
  };

  const mostrar_estado = (tipo, mensaje) => {
    estado.dataset.estado = tipo;
    estado.textContent = mensaje;
  };

  const limpiar_validaciones = () => {
    campos.forEach((campo) => {
      campo.setCustomValidity('');
      campo.removeAttribute('aria-invalid');
      campo.closest('.campo').dataset.estado = 'neutro';
      document.getElementById(`error_${campo.name}`).textContent = '';
    });
    actualizar_contador();
  };

  /* Validación en tiempo real (delegación de eventos sobre el formulario). */
  formulario.addEventListener('input', (evento) => {
    if (!evento.target.matches('[data-campo]')) return;
    validar_campo(evento.target);
    if (evento.target === area_mensaje) actualizar_contador();
  });

  formulario.addEventListener('focusout', (evento) => {
    if (evento.target.matches('[data-campo]')) validar_campo(evento.target);
  });

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault(); // evita la recarga de la página

    const invalidos = campos.filter((campo) => !validar_campo(campo));
    if (invalidos.length > 0) {
      mostrar_estado('error', textos.estados.revisar);
      invalidos[0].focus();
      return;
    }

    boton_enviar.disabled = true;
    mostrar_estado('enviando', textos.estados.enviando);

    try {
      /* No hay backend: se simula la latencia de red de un envío real. */
      await new Promise((resolver) => setTimeout(resolver, 900));
      const nombre = formulario.elements.nombre.value.trim();
      formulario.reset();
      mostrar_estado('exito', formatear(textos.estados.exito, { nombre }));
    } finally {
      boton_enviar.disabled = false;
    }
  });

  formulario.addEventListener('reset', () => {
    estado.textContent = '';
    delete estado.dataset.estado;
    /* Los valores se restablecen DESPUÉS del evento: se limpia en la siguiente tarea. */
    setTimeout(limpiar_validaciones, 0);
  });

  limpiar_validaciones();
}
