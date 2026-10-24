# Calendar App

Aplicación de **calendario de eventos** construida con **React + Vite**, con **autenticación por JWT**, estado global en **Redux Toolkit** y vistas de mes, semana, día y agenda gracias a **react-big-calendar**. Es el _frontend_ de un backend REST externo: el usuario se registra o inicia sesión, y desde ahí crea, edita y elimina sus eventos.

**Demo:** [calendar-app-five-sooty.vercel.app](https://calendar-app-five-sooty.vercel.app)

![Tech](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Tech](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Tech](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux)
![Tech](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter)
![Tech](https://img.shields.io/badge/Axios-1-5A29E4?logo=axios)
![Tech](https://img.shields.io/badge/Jest-29-C21325?logo=jest)
![Tech](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap)

---

## Tabla de contenidos

- [Calendar App](#calendar-app)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Qué hace el proyecto](#qué-hace-el-proyecto)
  - [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
    - [Requisitos](#requisitos)
    - [Instalación](#instalación)
    - [Variables de entorno](#variables-de-entorno)
    - [Scripts](#scripts)
  - [Uso](#uso)
  - [Cómo funciona](#cómo-funciona)
    - [1. Router (`src/router/AppRouter.jsx`)](#1-router-srcrouterapprouterjsx)
    - [2. Cliente HTTP (`src/api/calendarApi.js`)](#2-cliente-http-srcapicalendarapijs)
    - [3. Store (`src/store`)](#3-store-srcstore)
    - [4. Hooks (`src/hooks`)](#4-hooks-srchooks)
    - [5. Páginas y componentes](#5-páginas-y-componentes)
    - [6. Helpers (`src/helpers`)](#6-helpers-srchelpers)
    - [Endpoints que consume](#endpoints-que-consume)
    - [Flujo de la aplicación](#flujo-de-la-aplicación)
  - [Tests](#tests)
  - [Tecnologías](#tecnologías)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Personalización](#personalización)
  - [Licencia](#licencia)

---

## Qué hace el proyecto

- **Registro e inicio de sesión** contra una API REST; el token JWT se guarda en `localStorage`.
- **Renovación automática de sesión** al cargar la app (`/auth/renew`): si el token ya no es válido, se limpia la sesión.
- **Rutas protegidas**: sin sesión solo se puede acceder a `/auth/*`; con sesión, todo redirige al calendario.
- **Calendario en español** (mes, semana, día y agenda) con `react-big-calendar` y `date-fns`.
- **Crear, editar y eliminar eventos** (título, notas, fecha/hora de inicio y fin) desde un modal.
- **Validación del formulario**: la fecha de fin debe ser posterior a la de inicio y el título es obligatorio.
- **Recuerda la última vista** del calendario (`lastView` en `localStorage`).
- **Alertas** de error con SweetAlert2.
- **Tests** con Jest + Testing Library sobre slices, hooks, router, API y componentes.
- **CI** con GitHub Actions (lint + build en cada push).

---

## Cómo ejecutar el proyecto

### Requisitos

- **Node.js 20.10.0** (la versión usada en CI).
- Un **backend** compatible corriendo (ver [Endpoints que consume](#endpoints-que-consume)). Este repositorio contiene solo el _frontend_.

### Instalación

```bash
npm install
# o
yarn
```

### Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

```bash
VITE_MODE=dev
VITE_API_URL=http://localhost:4000/api
```

| Variable       | Descripción                                                                   |
| -------------- | ----------------------------------------------------------------------------- |
| `VITE_API_URL` | URL base de la API REST (se usa como `baseURL` de Axios).                     |
| `VITE_MODE`    | Modo de ejecución. Con `test` se omite `Modal.setAppElement("#root")`.        |

### Scripts

| Comando           | Descripción                                             |
| ----------------- | ------------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo de Vite con HMR.                 |
| `npm run build`   | Build de producción en `dist/`.                         |
| `npm run preview` | Sirve localmente el build de producción.                |
| `npm run lint`    | ESLint sobre `.js`/`.jsx` (0 warnings permitidos).      |
| `npm test`        | Jest en modo `--watchAll`.                              |

---

## Uso

| Acción                       | Cómo                                                              |
| ---------------------------- | ----------------------------------------------------------------- |
| Registrarse / iniciar sesión | Formularios **Registro** e **Ingreso** en `/auth/login`.          |
| Crear un evento              | Botón flotante **+** (abajo a la derecha) → rellenar el modal.     |
| Seleccionar un evento        | Clic sobre el evento.                                             |
| Editar un evento             | Doble clic sobre el evento → modificar y **Guardar**.             |
| Eliminar un evento           | Seleccionarlo y pulsar el botón flotante rojo de la papelera.     |
| Cambiar de vista             | Mes / Semana / Día / Agenda en la barra del calendario.           |
| Cerrar sesión                | Botón **Logout** de la barra superior.                            |

---

## Cómo funciona

### 1. Router (`src/router/AppRouter.jsx`)

Al montarse llama a `checkAuthToken()`. Mientras `status === "checking"` muestra un _loading_; después renderiza las rutas públicas (`LoginPage`) o privadas (`CalendarPage`) según el estado de autenticación.

### 2. Cliente HTTP (`src/api/calendarApi.js`)

Instancia de Axios con `baseURL = VITE_API_URL` y un **interceptor** de petición que añade la cabecera `x-token` con el token guardado en `localStorage`.

### 3. Store (`src/store`)

`configureStore` combina tres slices de Redux Toolkit:

- **`authSlice`** — `status` (`checking` / `authenticated` / `not-authenticated`), `user` y `errorMessage`. Acciones: `onChecking`, `onLogin`, `onLogout`, `clearErrorMessage`.
- **`calendarSlice`** — `events`, `activeEvent` e `isLoadingEvents`. Acciones: `onSetActiveEvent`, `onAddNewEvent`, `onUpdateEvent`, `onDeleteEvent`, `onLoadEvents` (evita duplicados por `id`) y `onLogoutCalendar`.
- **`uiSlice`** — `isDateModalOpen` con `onOpenDateModal` / `onCloseDateModal`.

### 4. Hooks (`src/hooks`)

Encapsulan el acceso al store y a la API para que los componentes no hablen con Redux directamente:

- **`useAuthStore`** — `startLogin`, `startRegister`, `checkAuthToken`, `startLogout`.
- **`useCalendarStore`** — `setActiveEvent`, `startSavingEvent` (PUT si el evento tiene `id`, POST si es nuevo), `startDeletingEvent`, `startLoadingEvents`, y el flag `hasEventSelected`.
- **`useUiStore`** — `openDateModal`, `closeDateModal`, `toggleDateModal`.
- **`useForm`** — estado de formulario genérico con `onInputChange`, `onResetForm` y validadores opcionales (`isFormValid`).

### 5. Páginas y componentes

- **`LoginPage`** — formularios de ingreso y registro (comprueba que ambas contraseñas coincidan).
- **`CalendarPage`** — renderiza `<Calendar>` con el `localizer` en español, carga eventos al montarse y gestiona selección, doble clic y cambio de vista.
- **`CalendarModal`** — modal (`react-modal`) con `react-datepicker` para crear/editar eventos.
- **`CalendarEvent`** — cómo se pinta cada evento: título + nombre del usuario.
- **`NavBar`**, **`FabAddNew`**, **`FabDelete`** — barra superior y botones flotantes.

### 6. Helpers (`src/helpers`)

- **`localizer`** — `dateFnsLocalizer` con la locale `es` de `date-fns`.
- **`getMessages`** — textos del calendario en español.
- **`dateFormatter`** — convierte `start`/`end` de string ISO a `Date` con `parseISO`.
- **`getEnvVariables`** — expone `import.meta.env` (se _mockea_ en Jest).

### Endpoints que consume

| Método   | Ruta             | Uso                                   |
| -------- | ---------------- | ------------------------------------- |
| `POST`   | `/auth`          | Login (`email`, `password`).          |
| `POST`   | `/auth/register` | Registro (`name`, `email`, `password`). |
| `GET`    | `/auth/renew`    | Renovar el token.                     |
| `GET`    | `/events`        | Listar eventos.                       |
| `POST`   | `/events`        | Crear evento.                         |
| `PUT`    | `/events/:id`    | Actualizar evento.                    |
| `DELETE` | `/events/:id`    | Eliminar evento.                      |

### Flujo de la aplicación

```
main.jsx
  └─ CalendarApp  (Provider store + BrowserRouter)
        └─ AppRouter
             ├─ checkAuthToken()  → GET /auth/renew
             ├─ status "not-authenticated" → LoginPage
             │      └─ startLogin / startRegister → guarda token → onLogin
             └─ status "authenticated" → CalendarPage
                    ├─ startLoadingEvents()  → GET /events → onLoadEvents
                    ├─ FabAddNew → setActiveEvent(nuevo) → CalendarModal
                    ├─ doble clic → CalendarModal → startSavingEvent (POST / PUT)
                    └─ FabDelete → startDeletingEvent (DELETE)
```

---

## Tests

Los tests viven en `tests/` y cubren los slices (`auth`, `calendar`, `ui`), los hooks `useAuthStore` y `useUiStore`, `AppRouter` (con _snapshot_), el cliente `calendarApi` y `FabDelete`.

```bash
npm test
```

`jest.setup.js` carga las variables desde un archivo **`.env.test`** (no incluido en el repo) y _mockea_ `getEnvVariables` para usar `process.env`. Crea ese archivo con las mismas claves que `.env.example` (por ejemplo `VITE_MODE=test`) antes de ejecutar los tests.

---

## Tecnologías

- **React 18** + **Vite 5**
- **Redux Toolkit** + **React Redux** — estado global.
- **React Router 6** — rutas públicas/privadas.
- **Axios** — cliente HTTP con interceptor.
- **react-big-calendar**, **react-datepicker**, **react-modal** — calendario, selector de fecha y modal.
- **date-fns** — fechas y locale española.
- **SweetAlert2** — alertas.
- **Bootstrap 5.3** y **Font Awesome 6.5** (vía CDN en `index.html`).
- **Jest**, **Testing Library**, **Babel** — testing.
- **ESLint** + **GitHub Actions** — calidad y CI.

---

## Estructura del proyecto

```
Calendar-app/
├── .github/workflows/github-actions.yml   # CI: install, lint y build
├── public/
├── src/
│   ├── api/calendarApi.js                 # Axios + interceptor x-token
│   ├── auth/pages/LoginPage.jsx           # Login y registro
│   ├── calendar/
│   │   ├── components/                    # CalendarEvent, CalendarModal, FabAddNew, FabDelete, NavBar
│   │   └── pages/CalendarPage.jsx
│   ├── helpers/                           # localizer, getMessages, dateFormatter, getEnvVariables
│   ├── hooks/                             # useAuthStore, useCalendarStore, useUiStore, useForm
│   ├── router/AppRouter.jsx
│   ├── store/                             # store.js + slices auth, calendar, ui
│   ├── CalendarApp.jsx
│   ├── main.jsx
│   └── styles.css
├── tests/                                 # api, calendar, fixtures, hooks, mocks, router, store
├── .env.example
├── babel.config.json
├── jest.config.json
├── jest.setup.js
├── index.html
├── vite.config.js
└── package.json
```

---

## Personalización

| Dónde                                 | Qué                                       | Por defecto            |
| ------------------------------------- | ----------------------------------------- | ---------------------- |
| `.env` → `VITE_API_URL`               | URL del backend                           | `http://localhost:4000/api` |
| `src/helpers/getMessages.js`          | Textos del calendario                     | Español                |
| `src/helpers/calendarLocalizer.js`    | Locales de `date-fns`                     | `es`                   |
| `CalendarPage` → `eventStyleGetter`   | Color de los eventos                      | `#347CF7`              |
| `CalendarPage` → `lastView`           | Vista inicial si no hay una guardada      | `week`                 |

---

## Licencia

Proyecto de uso libre con fines educativos y de práctica.
