# Hoja de vida interactiva — Santiago Alfred Michovich

**Segundo Examen Práctico (Unidad II)** de *Tecnologías Web I (SIS-214)*.

| | |
|---|---|
| **Sitio en producción** | https://santyalfred.github.io/SIS214_ExamenPractico2_MichovichSantiago/ |
| **Repositorio** | https://github.com/santyalfred/SIS214_ExamenPractico2_MichovichSantiago |
| **Estudiante** | Santiago Alfred Michovich — Ingeniería de Sistemas |

---

## 1. Qué es este proyecto

Un sitio de una sola página (un único `index.html`) cuyo todo contenido se carga en tiempo de ejecución desde `data/datos.json` y se pinta en el DOM mediante módulos ES6+. El HTML es únicamente el esqueleto semántico; para editar el CV basta con modificar el JSON.

**Identidad visual:** el tema claro se inspira en **River Plate** (blanco, rojo y negro, con la banda diagonal) y el tema oscuro en el **FC Barcelona** (azul marino, granate y dorado, con las rayas verticales).

## 2. Arquitectura

```
SIS214_ExamenPractico2_MichovichSantiago/
├── index.html              
├── css/
│   └── styles.css         
├── js/
│   ├── tema_inicial.js     
│   ├── main.js             
│   └── modulos/
│       ├── datos.js          # fetch de data/datos.json
│       ├── utilidades.js     # helpers puros (crear, formatear, normalizar…)
│       ├── almacenamiento.js # localStorage + JSON.stringify / JSON.parse
│       ├── plantillas.js     # construcción de nodos DOM (sin innerHTML)
│       ├── render.js         # pinta el contenido del JSON en la página
│       ├── tema.js           # [1] modo claro / oscuro
│       ├── menu.js           # [2] menú hamburguesa
│       ├── filtro.js         # [3] buscador en tiempo real
│       ├── formulario.js     # [4] formulario de contacto
│       └── github.js         # [5] API REST de GitHub (fetch async/await)
├── data/
│   └── datos.json          # Única fuente de datos del proyecto
├── assets/
│   ├── imagenes/
│   ├── audios/
│   └── videos/
└── README.md
```

**Flujo de la aplicación:** `main.js` carga el JSON, lo congela con `Object.freeze` (inmutabilidad), `render.js` pinta la página, y luego se activan las cinco funcionalidades.

## 3. Tecnologías

HTML5 semántico · CSS3 (custom properties, Flexbox, Grid, media queries, animaciones con *scroll-driven animations* como mejora) · JavaScript ES6+ (módulos nativos, `async/await`, `fetch`, `localStorage`). 
**Sin frameworks ni librerías externas.**

## 4. Funcionalidades interactivas (JavaScript ES6+)

| # | Funcionalidad | Archivo | Detalle técnico |
|---|---|---|---|
| 1 | **Conmutador de tema** | `tema.js` | Muta `data-tema` en `<html>`. La preferencia persiste en `localStorage` serializada con `JSON.stringify()` y restaurada con `JSON.parse()` (tolera JSON corrupto). Respeta `prefers-color-scheme` si no hay preferencia guardada. |
| 2 | **Menú hamburguesa responsivo** | `menu.js` | Captura `click`, conmuta la clase `abierta` y muta `aria-expanded` (`true`/`false`). Cierra con `Escape`, al hacer clic fuera o en un enlace (delegación de eventos). Visible en móvil y tablet. |
| 3 | **Buscador en tiempo real** | `filtro.js` | Evento `input`. Filtra proyectos, habilidades y certificaciones con `.filter()` encadenado a `.map()`. Los datos originales están congelados: cada búsqueda crea colecciones nuevas. Ignora tildes y mayúsculas; anuncia el número de resultados con `aria-live`. |
| 4 | **Formulario de contacto** | `formulario.js` | Intercepta `submit` con `event.preventDefault()`. Usa la Constraint Validation API de HTML5 (`required`, `minlength`, `type="email"`, `pattern`) y valida en tiempo real con `input`, mostrando estados de error / éxito por campo. |
| 5 | **Módulo asíncrono (Fetch API)** | `github.js` | Consume `api.github.com` con `async/await` y `try…catch`. Evalúa `response.ok` y gestiona 200, 400, 403, 404 y 500, además de fallos de red y *timeout* (`AbortController`). La interfaz refleja **loading** (esqueletos), **success** (tarjetas) y **error** (mensaje + botón *Reintentar*). |

## 5. Diseño y maquetación (CSS3)

- **Tokens de diseño** en `:root`: colores principales, tipografías y unidades de espaciado (`--unidad_espaciado`), más reset universal `* { box-sizing: border-box; margin: 0; padding: 0; }`.
- **Mobile-First:** los estilos base son de móvil; se amplían con `@media (min-width: 768px)` (tablet, 768–1024 px) y `@media (min-width: 1025px)` (escritorio, > 1024 px).
- **Flexbox** para alineaciones unidimensionales (navegación, botones, chips) y **CSS Grid** para esquemas bidimensionales (hero, rejillas de tarjetas, formulario + aside, cabecera por áreas).
- Tema claro y oscuro implementados únicamente redefiniendo variables CSS.
- Respeta `prefers-reduced-motion`.

## 6. Semántica y accesibilidad

- Etiquetas: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer` (más `figure`, `address`, `hgroup`, `time`, `meter`, `dl`, `table`…). **Cero `<div>`**, tampoco en el DOM generado por JS.
- WAI-ARIA: `aria-label`, `aria-labelledby`, `aria-expanded`, `aria-controls`, `aria-pressed`, `aria-describedby`, `aria-invalid`, `aria-live`, `aria-busy`, `role="search"`, `role="status"`, `role="alert"`.
- Enlace *Saltar al contenido principal*, foco visible, navegación completa por teclado, `alt` en todas las imágenes y contraste revisado en ambos temas.
- Nomenclatura `snake_case` en clases, ids, variables y funciones.

## 7. Ejecución local

> El sitio carga `data/datos.json` con `fetch` y usa módulos ES6, por lo que **no funciona abriendo `index.html` con doble clic** (`file://`). Hay que servirlo por HTTP:

**Opción A — VS Code (recomendada):** instalar la extensión *Live Server* → clic derecho sobre `index.html` → **Open with Live Server**.

**Opción B — Python:**
```bash
python -m http.server 8000
# abrir http://localhost:8000
```

## 8. Editar el contenido

Todo el texto, las rutas de imágenes/audio/video, las habilidades, proyectos, idiomas, mensajes de validación y el usuario de GitHub (`"github": { "usuario": … }`) están en `data/datos.json`. No hace falta tocar HTML ni JS.

## 9. Control de versiones y despliegue

- **Convención de commits:** mensajes descriptivos en imperativo, atómicos y progresivos (`Agrega estructura semántica`, `Implementa módulo de tema con localStorage`, `Corrige desbordamiento horizontal en móvil`…).

