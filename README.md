# FinanzApp — frontend

Frontend en Angular para el backend FastAPI de `finanz-app`.

Cómo está organizado el código y por qué está en **[ARCHITECTURE.md](ARCHITECTURE.md)**. Léelo antes de añadir una carpeta: explica qué capa puede importar a cuál, y por qué el cliente generado no sale de `core`.

## Stack y decisiones ya tomadas

- **Angular 22** (última versión estable), componentes standalone, `@if`/`@for`.
- **Angular Material** (Material 3) con paletas propias en `src/styles/_theme-colors.scss`, y las personalizaciones por componente en `src/styles/`.
- **Estado**: signals nativos, sin librería de estado adicional.
- **SPA pura**, sin SSR.
- **Autenticación**: el backend entrega `access_token`/`refresh_token` como cookies `httpOnly` (no en el cuerpo JSON) — por eso el cliente de API se configura con `withCredentials: true` (ver `provideApi` en `app.config.ts`).
- **Cliente de API**: generado con [`@openapitools/openapi-generator-cli`](https://github.com/OpenAPITools/openapi-generator-cli) a partir de `/openapi.json` del backend. Ver sección siguiente.
- **Testing**: Vitest (runner por defecto de Angular CLI 22).
- **Package manager**: npm.

## Cliente de API generado

`src/app/api/` es código generado, no se edita a mano. Para regenerarlo (con el backend corriendo en `localhost:8000`):

```bash
npm run generate:api
```

Esto ejecuta `openapi-generator-cli generate -i http://localhost:8000/openapi.json -g typescript-angular -o src/app/api`. Repetir cada vez que el backend cambie su esquema.

El cliente ya viene cableado en `app.config.ts` vía `provideApi({ basePath: environment.apiUrl, withCredentials: true })`. `environment.apiUrl` **no** lleva `/api/v1` — los paths generados ya incluyen ese prefijo.

`src/app/api/` se versiona en git (no se gitignora): así cualquiera que clone el repo puede instalar y arrancar sin depender de tener el backend corriendo o Java instalado solo para compilar. Regenerar con `npm run generate:api` y commitear el resultado cuando cambie el contrato del backend.

`model/` sale plano (todos los schemas en la misma carpeta) porque OpenAPI no expone tag/dominio a nivel de schema, solo a nivel de operación — es una limitación del propio generador, no del backend. `api/` sí queda agrupado por dominio (`accounts.service.ts`, `categories.service.ts`, `transactions.service.ts`...) porque esos vienen de los tags de cada endpoint.

## Estado actual del código

Aplicación móvil de una sola columna: barra superior con la identidad de la pantalla y el menú de usuario, navegación inferior flotante, y formularios en bottom sheets.

- **Sesión** — login y registro, cookies `httpOnly`, refresco automático vía interceptor y guard en las rutas.
- **Grupos** — listar, crear, editar y archivar. El grupo de trabajo se elige desde el menú del avatar y se guarda en `sessionStorage`.
- **Cuentas** — listado con filtro de archivadas, y detalle como armazón con secciones enrutadas (`/cuentas/:id/movimientos`).
- **Movimientos** — lista agrupada por día con scroll infinito; crear, editar y borrar.
- **Categorías** — árbol de dos niveles con archivado, color e icono.
- **Dashboard** — todavía vacío.

Pendiente: planes de pago (el servicio de `core` existe, la feature no) y estadísticas por cuenta.

## Arrancar

```bash
npm install
npm start
```

Sirve en `http://localhost:4200`. Necesita el backend corriendo en `http://localhost:8000` (o cambiar `apiUrl` en `src/environments/environment.ts`) y `CORS_ALLOWED_ORIGINS` del backend incluyendo `http://localhost:4200`.

```bash
npm run build          # build de producción
npm test               # tests unitarios (Vitest)
npm run generate:api   # regenerar el cliente de API desde el backend
npm run lint:boundaries # comprobar la dirección de las dependencias entre capas
npm run format         # Prettier sobre src/
```

`lint:boundaries` es el que sostiene las reglas de ARCHITECTURE.md: recorre los imports de `src/app`, clasifica los dos extremos y falla si alguno apunta donde no debe.
