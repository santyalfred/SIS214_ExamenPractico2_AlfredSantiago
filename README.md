# Hoja de vida - Parcial 1 - Santiago Alfred Michovich

## Datos
- **Nombre:** Santiago Alfred Michovich
- **Carrera:** Ingeniería de Sistemas
- **Universidad:** Universidad Católica Boliviana (UCB)
- **Asignatura:** Tecnologías Web I 

## Descripción del proyecto
Hoja de vida desarrollado con **HTML5 semántico, CSS3 y JavaScript**. 
El proyecto separa estructura, estilos y comportamiento en archivos independientes 
(`index.html`, `css/styles.css`,`js/main.js`), aplica diseño responsivo, 
variables CSS, Flexbox, CSS Grid y dos funcionalidades implementadas en JavaScript.

## Estructura del proyecto
```
Hoja-de-vida-Evaluacion-Parcial/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   ├── audio/
│   └── video/
└── README.md
```

## Funcionalidades implementadas en JavaScript
1. **Cambio de modo claro/oscuro:** botón en el encabezado que alterna entre
   dos temas visuales con identidad propia, persistiendo la elección del
   usuario y respetando la preferencia del sistema
   operativo si no hay una elección previa.
2. **Validación del formulario de contacto:** validación en tiempo real y al
   enviar (nombre, correo, teléfono, mensaje, motivo y checkbox de aceptación),
   con mensajes de error accesibles y confirmación de envío
   simulada, sin recargar la página.

## Paleta de colores — Identidad visual
El proyecto usa **dos temas con identidad futbolística**, cada uno con sus
propios colores oficiales (investigados y aproximados a los tonos reales de
cada club):

| Tema | Inspiración | Colores |
|---|---|---|
| **Claro (por defecto)** | River Plate | Rojo `#D6001C`, blanco `#FFFFFF`, negro `#111111` |
| **Oscuro** | FC Barcelona | Azul marino `#004D98`/`#0B1E3D`, granate `#A50044`, dorado `#EDBB00` |

Todos los colores están centralizados como variables CSS en `:root` (tema
claro) y sobrescritos en `html.tema_oscuro` (tema oscuro), por lo que cambiar
de tema no requiere duplicar estilos.

## CSS3 aplicado
- **Variables (`:root`)** para colores, tipografía, sombras y bordes.
- **Flexbox:** en la navegación, en la sección de Presentación (foto + datos)
  y en **Habilidades Técnicas** (`.skills_flex`).
- **CSS Grid:** en **Proyectos Destacados** (`.projects_grid`).
- **Diseño responsive:** `@media (max-width: 700px)` que reorganiza todo a
  una sola columna para vista móvil.
- Sombras, bordes redondeados y transiciones suaves entre temas.

## Etiquetas HTML5 semánticas utilizadas
`header`, `nav`, `main`, `section`, `article`, `footer`, `figure`,
`figcaption`, `address`, `blockquote`, `time`, `mark`, `meter`, `table`
(`caption`, `thead`, `tbody`, `th`, `td`), `form`, `fieldset`, `legend`,
`label`, `audio`, `video`.

## Accesibilidad
- `lang="es"` en `<html>`.
- Enlace "Saltar al contenido principal".
- `alt` descriptivo en todas las imágenes.
- `<label for="...">` en cada campo del formulario.
- Jerarquía de encabezados `h1` → `h2` → `h3`.
- Mensajes de error con `role="alert"` y estado del formulario con
  `role="status"` / `aria-live="polite"`.
- Estilos de foco visible para navegación por teclado.

## Instrucciones para visualizar el proyecto
1. Descarga la carpeta completa `michovich-santiago-cv/`.
2. Coloca tu fotografía y capturas en `assets/images/` (y audio/video en sus
   carpetas correspondientes) con los mismos nombres que usa `index.html`, o
   actualiza los `src` si usas otros nombres.
3. Abre `index.html` con doble clic o "Abrir con" tu navegador. No requiere
   servidor ni instalación de paquetes.

