# syntax=docker/dockerfile:1

# Angular compila a ficheros estáticos, así que la imagen final no lleva Node:
# solo el servidor y el bundle. Node se queda en la primera etapa.

FROM node:22-alpine AS build
WORKDIR /app

# Las dependencias antes que el código: mientras package-lock.json no cambie,
# esta capa se reaprovecha y `npm ci` no vuelve a correr.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# `production` aplica el fileReplacements que cambia environment.ts por
# environment.production.ts, donde está la URL de la API. Esa URL queda
# HORNEADA en el bundle: cambiarla exige reconstruir la imagen, no basta con
# reiniciar el contenedor ni con una variable de entorno.
RUN npx ng build --configuration production

# Caddy, la misma pieza que ya hace de proxy en el VPS, en vez de meter un
# segundo servidor web con otra sintaxis. Este no sabe de dominios ni de TLS:
# escucha en el 80 de la red interna y el Caddy del VPS le reenvía.
FROM caddy:2-alpine AS runtime

# Lo único que se configura es el respaldo de la SPA, y no es decoración: las
# rutas de Angular (/grupos, /cuentas/xxx) no existen como ficheros, así que
# sin esta línea recargar cualquiera de ellas devuelve 404. El resto son los
# valores por defecto de Caddy.
COPY <<'CADDY' /etc/caddy/Caddyfile
:8080 {
	root * /srv
	encode zstd gzip
	try_files {path} /index.html
	file_server
}
CADDY

COPY --from=build /app/dist/finanz-app/browser /srv

# Usuario sin privilegios: si alguien consigue ejecutar código dentro del
# contenedor, no lo hace como root. Caddy necesita escribir en /data y /config
# (los XDG_* que fija la imagen base), así que cambian de dueño con él.
RUN adduser -D -u 1000 appuser \
    && chown -R appuser:appuser /data /config
USER appuser

# 8080 y no 80 porque un proceso sin privilegios no puede escuchar por debajo
# del 1024. El número da igual: nadie publica puertos, y el Caddy del VPS
# alcanza este contenedor por su alias de red.
EXPOSE 8080
