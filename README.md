# FinanzApp — frontend

Frontend en Angular para el backend FastAPI de `finanz-app`. Este repo está en fase de arranque: hay proyecto, pero ninguna feature todavía — el diseño de la aplicación (estructura de carpetas, componentes, pantallas) queda pendiente de definir.

## Stack y decisiones ya tomadas

- **Angular 22** (última versión estable), componentes standalone, `@if`/`@for`.
- **Angular Material** (Material 3, tema `azure-blue`) ya instalado.
- **Estado**: signals nativos, sin librería de estado adicional.
- **SPA pura**, sin SSR.
- **Autenticación**: el backend entrega `access_token`/`refresh_token` como cookies `httpOnly` (no en el cuerpo JSON).
- **Cliente de API**: pendiente de generar a partir del OpenAPI del backend (`/openapi.json`), en vez de escribirlo a mano. No implementado todavía.
- **Testing**: Vitest (runner por defecto de Angular CLI 22).
- **Package manager**: npm.

## Estado actual del código

- `src/app/app.config.ts` — providers base: router, animaciones, `HttpClient`.
- `src/environments/` — `apiUrl` de desarrollo (`http://localhost:8000/api/v1`) y de producción (placeholder a sustituir).
- Sin rutas, sin componentes de feature: todo eso depende del diseño que ya tienes pensado.

## Arrancar

```bash
npm install
npm start
```

Sirve en `http://localhost:4200`. Necesita el backend corriendo en `http://localhost:8000` (o cambiar `apiUrl` en `src/environments/environment.ts`) y `CORS_ALLOWED_ORIGINS` del backend incluyendo `http://localhost:4200`.

```bash
npm run build   # build de producción
npm test        # tests unitarios (Vitest)
```
