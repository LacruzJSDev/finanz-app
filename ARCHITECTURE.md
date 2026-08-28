# Arquitectura

Este documento explica **cómo está organizado el código y por qué**, para poder
decidir dónde va algo nuevo sin tener que preguntar.

No es hexagonal, y no debe serlo: las reglas de negocio viven en el backend.
Aquí no hay un dominio propio que proteger de un cambio de infraestructura, así
que montar puertos y adaptadores sería pagar un coste sin cobrar el beneficio.

## La única regla

> **Las dependencias van en una sola dirección. Nunca hacia arriba, nunca en
> círculo.**

Todo lo demás sale de ahí.

Cuando A usa B y B usa A, tienes un **ciclo**: ya no puedes entender A sin
entender B, ni cambiar uno sin revisar el otro, ni borrar ninguno de los dos.
El código deja de tener piezas y pasa a tener una masa.

Mantener la dirección es lo que permite decir "esto de aquí no puede haber roto
aquello de allá", y acertar.

## Estructura de carpetas

```
src/app/
├── api/            cliente generado por OpenAPI — no se edita a mano
├── core/           datos y estado. Un servicio por entidad
│   ├── accounts/         AccountsService
│   ├── account-groups/   AccountGroupsService
│   ├── categories/       CategoriesService
│   ├── transactions/     TransactionsService
│   ├── payment-plans/    PaymentPlansService
│   ├── group-members/    GroupMembersService
│   ├── invitations/      InvitationsService
│   ├── users/            UsersService
│   ├── auth/             sesión, guard e interceptor de refresco
│   ├── http/             frontera de errores: convierte fallos HTTP en ApiError
│   ├── forms/            volcado de errores del back a los controles
│   ├── notifications/    avisos al usuario
│   ├── ui/               contexto de grupo y de página
│   └── models.ts         única puerta a los tipos generados, que son privados
├── shared/         piezas reutilizables que no saben nada del dominio
│   ├── ui/               color-icon, paginator
│   ├── colors/           color-picker
│   ├── icons/            icon-picker
│   ├── money/            céntimos ↔ euros
│   └── date/             ISO ↔ Date
├── layout/         el armazón visible en todas las pantallas
│   ├── shell/            marco del viewport
│   ├── top-bar/          barra superior
│   └── bottom-nav/       navegación inferior
└── features/       pantallas y UI de dominio
    ├── accounts/
    ├── account-groups/
    ├── categories/
    ├── transactions/
    ├── auth/
    └── dashboard/
```

Dentro de una feature la forma es siempre la misma:

```
features/<nombre>/
├── pages/          componentes a los que se llega por una ruta
├── components/     piezas que solo usa esta feature
├── pipes/          transformaciones de esta feature
├── <nombre>.routes.ts   si tiene rutas propias
└── index.ts             si otra feature la usa
```

## Las capas

| Capa        | Qué contiene                | Puede importar de            |
| ----------- | --------------------------- | ---------------------------- |
| `api/`      | Cliente HTTP generado       | — (solo lo importa `core`)   |
| `core/`     | Datos y estado              | `api`, `core`                |
| `shared/`   | UI y utilidades sin dominio | `shared`                     |
| `layout/`   | Armazón de la aplicación    | `core`, `shared`, `layout`   |
| `features/` | Pantallas y UI de dominio   | `core`, `shared`, su feature |

Lee la tabla de abajo hacia arriba: `features` puede apoyarse en todo lo que
tiene debajo, y nada de lo de abajo sabe que `features` existe.

**`api/` está aislado a propósito.** Lo genera un comando y se regenera entero.
Sus nombres (`getAccountsApiV1AccountsGet`) son ruido del generador, no
vocabulario de la aplicación. Si se filtrara a las pantallas, regenerar el
cliente rompería la aplicación entera.

Pero los tipos generados sí hacen falta fuera, y están detrás de ese muro. Por
eso existe un único hueco:

```ts
// core/models.ts
export * from '../api/model/models';
```

**`models.ts` es un puente sobre el muro, no un escaparate de core.** Está ahí
porque lo que reexporta es inalcanzable de otro modo, y por eso su cuerpo es
una sola línea: regeneras el cliente y el fichero sigue siendo correcto sin
tocarlo, porque no enumera nada.

Esto separa dos cosas que el generador mezcla en la misma carpeta: el
**contrato** (los tipos: `AccountRead`, `TransactionTypeEnum`) y el
**transporte** (el cliente HTTP). Solo el transporte tiene que ser privado; el
contrato es el idioma que habla toda la aplicación.

Del resto de core **no hay puente ni hace falta**: se importa el fichero
concreto, porque ya está del lado accesible.

```ts
import { AccountsService } from '../../../core/accounts/accounts.service';
import { ApiError } from '../../../core/http/api-error';
```

Añadir a `models.ts` cosas escritas a mano lo estropearía: dejaría de ser
mecánico y pasaría a ser una lista que alguien tiene que mantener.

**`core/` es la única capa que habla con el servidor.** Cada servicio expone
signals de solo lectura y métodos con nombres del negocio (`getAccounts`,
`createCategory`).

**Los errores tampoco salen de core.** El interceptor de `core/http/` recoge el
`HttpErrorResponse` de Angular y lo convierte en `ApiError`, un tipo propio con
`code`, `message`, `status` y `details`. No traduce el contenido —el mensaje
del backend pasa intacto— sino la **forma**: aplana tres niveles de anidamiento
y junta datos que venían en dos objetos distintos.

Es el mismo patrón que `models.ts` aplicado a los fallos, y tiene nombre:
**capa anticorrupción**, una pieza cuyo único trabajo es impedir que el modelo
de otro sistema se cuele en el tuyo. Gracias a ella ninguna feature ve nunca un
`HttpErrorResponse`: todas ven un solo tipo. Si algún día quieres que el
frontend sea dueño de las palabras —internacionalizar, reescribir mensajes—
ese es el único sitio donde tocar.

**`shared/` es la prueba del algodón de la reutilización.** Si una pieza
necesita un modelo del dominio, no es shared. `ColorIcon` y `Paginator` valen
para cualquier aplicación; por eso están ahí.

## Dominio y feature no son lo mismo

Esta es la distinción que más confunde, porque las carpetas se llaman igual.

**Dominio** es un _concepto_ del negocio: una cuenta, una categoría, una
transacción. Vive en `core/`, y **cualquiera puede usarlo**. No hay fronteras
entre dominios porque no hay nada que proteger: son datos.

**Feature** es una _carpeta de interfaz_: las pantallas y componentes con los
que el usuario manipula uno o varios dominios. Vive en `features/`, y **sí
tiene fronteras**, porque la UI se acopla con facilidad y es cara de desenredar.

Que exista `core/transactions` **no obliga** a que exista
`features/transactions`, ni al revés.

### La pregunta que decide

Antes de crear una feature, o de importar de otra:

> **¿Necesito su interfaz, o solo sus datos?**

Si solo son datos, **no hay ninguna decisión de arquitectura que tomar**: se
piden a `core` y ya está. Casos reales:

| Necesidad                                                  | ¿Qué necesita? | Dónde se resuelve                          |
| ---------------------------------------------------------- | -------------- | ------------------------------------------ |
| La lista de transacciones muestra quién introdujo cada una | Datos          | `core/group-members` + un pipe propio      |
| Los presupuestos usarán transacciones                      | Datos          | `core/transactions`                        |
| El detalle de cuenta muestra la lista de movimientos       | **Interfaz**   | `features/transactions`, por su `index.ts` |

Los dos primeros parecen dependencias entre features y no lo son.
`TransactionRead.created_by` es un id, no un objeto: mostrar el nombre es una
búsqueda, no reutilizar una pantalla.

### Dos clases de feature

**Feature de pantalla.** Tiene rutas, se navega a ella, y **no exporta nada**:
nadie importa una pantalla ajena. Hoy: `accounts`, `account-groups`,
`categories`, `auth`, `dashboard`.

**Feature de dominio.** No tiene rutas propias. Agrupa la interfaz de un
concepto que usan varias pantallas, y **exporta**: es su razón de existir. Hoy:
`transactions`.

La forma rápida de distinguirlas: mira si tiene `*.routes.ts`.

### Dominio y pantalla son ejes distintos

Una feature puede tener pantallas que no cuelgan de su sección de navegación.
Las invitaciones son dominio de grupos, y generan dos pantallas en sitios
opuestos:

- **Invitar** — se llega desde el detalle del grupo, y cuelga de `/grupos/:id`.
- **Aceptar invitación** — se llega desde el avatar de la barra superior, y es
  una ruta suelta, porque quien la usa todavía no pertenece a ese grupo.

Las dos viven en `features/account-groups`. Que una pantalla no cuelgue de la
sección de su dominio **no la convierte en una feature nueva**.

### No se crean carpetas por adelantado

`core/payment-plans` existe y `features/payment-plans` todavía no. Una feature
sin componentes no es arquitectura, es una carpeta vacía. Se crea el día que
hay algo que meter dentro.

## Dónde vive el estado

Saber en qué capa va cada dato es tan importante como saber quién puede
importar a quién. La regla:

> **`loading` describe el estado de unos datos compartidos y vive en el
> servicio. `submitting` describe el estado de una interacción concreta y vive
> en el componente.**

Parece incoherente hasta que se ve el motivo.

### Por qué la carga va en el servicio

`AccountsService.accounts` es una signal que puede leer cualquier componente.
Que esos datos se estén recargando **es una propiedad de los datos**, no de
quien los mira. Si mañana dos pantallas pintan la lista de cuentas, las dos
deben saber que está cargando sin tener que enterarse cada una por su cuenta.

Está donde vive el dato porque _es_ información sobre el dato.

### Por qué el envío va en el componente

Que un formulario esté enviando no le importa a nadie más: solo lo usa su
propio botón. Y hay tres razones duras, no de gusto:

**1. Los servicios son singletons; los formularios, no.** Un servicio marcado
`providedIn: 'root'` se crea una sola vez y vive lo que vive la aplicación —eso
es un **singleton**—. Un bottom sheet nace al abrirlo y muere al cerrarlo. Si
el estado de envío viviera en el servicio y algo lo dejara encendido, **el
siguiente formulario que se abriera aparecería bloqueado**, y el fallo
sobreviviría a la navegación. Un estado en el componente muere con él.

**2. Hay varios formularios sobre la misma entidad.** Crear cuenta y editar
cuenta usan el mismo `AccountsService`. Un solo indicador ahí lo compartirían
los dos.

**3. "Terminado" significa cosas distintas.** Cuando termina una carga, el
resultado se queda en una signal que sigue viva y le sirve a todos. Cuando
termina un envío, el formulario se cierra: un instante después ese estado ya no
le importa a nadie.

### La forma corta de decidirlo

| Pregunta                                 | Si es que sí        |
| ---------------------------------------- | ------------------- |
| ¿Otro componente necesitaría saberlo?    | Va en el servicio   |
| ¿Sobrevive al componente que lo provocó? | Va en el servicio   |
| ¿Es de esta pantalla y de nadie más?     | Va en el componente |

Cargar una lista responde que sí a las dos primeras. Enviar un formulario, no.

### Simplificaciones asumidas

`loading` está solo en los métodos de lista, los únicos que alimentan un estado
de pantalla completa. `getAccountById` no lo tiene.

Y es **un solo booleano por servicio**: si dos cargas del mismo servicio se
solaparan, la primera en terminar lo apagaría mientras la otra sigue en vuelo.
Hoy no ocurre porque cada pantalla carga una lista. El arreglo, cuando haga
falta, es contar peticiones en vuelo en lugar de encender y apagar un booleano.

## Caso de estudio: el detalle de cuenta

Es el ejemplo que mejor enseña cómo encaja todo, porque es donde chocan la
navegación, la propiedad del código y el crecimiento.

### El problema

`/cuentas/:id` muestra hoy el saldo y los movimientos. Pronto tiene que mostrar
también los pagos planificados, y más adelante presupuestos.

La salida fácil es ir añadiendo bloques a esa página. El resultado conocido es
un componente que carga cuatro cosas distintas, abre media docena de
formularios y ya nadie toca sin miedo. Un **god object**: una pieza que sabe
demasiado, con tantas razones para cambiar que siempre está cambiando.

### La solución: armazón y secciones

La página deja de mostrar contenido y pasa a ser un **armazón** (_shell_): un
componente que solo prepara el contexto —cargar la cuenta, pintar cabecera y
saldo— y deja un hueco donde el router encaja la sección activa.

```
/cuentas/:id                 armazón: carga la cuenta y pinta <router-outlet>
/cuentas/:id/movimientos     sección
/cuentas/:id/planificados    sección
```

```
features/accounts/
└── pages/
    └── account-detail/          armazón. Define las rutas hijas.

features/transactions/
├── pages/
│   └── account-transactions/    la sección /cuentas/:id/movimientos
├── components/                  lista y formularios, internos
└── index.ts                     exporta la página

features/payment-plans/
├── pages/
│   └── account-payment-plans/   la sección /cuentas/:id/planificados
└── index.ts                     exporta la página
```

### Lo que hay que aprender de aquí

**1. Una página vive en la feature del concepto que muestra, no en la que la
enruta.**

La sección de movimientos aparece dentro de una URL de cuentas, pero **es de
transacciones**: usa sus datos, sus formularios y su vocabulario. Si la
metieras en `features/accounts`, el día que los presupuestos quieran enseñar
movimientos tendrían que importar de `accounts`, que no tiene nada que ver.

Dicho de otra forma: **la URL dice dónde se ve algo; la carpeta dice quién lo
mantiene.** No tienen por qué coincidir.

**2. Por eso `transactions` necesita `index.ts` y `accounts` no.**

`accounts` importa la sección de transacciones, así que `transactions` tiene
que exponerla. Al revés no pasa nunca: nadie importa el detalle de cuenta.
La dirección de la flecha decide quién necesita puerta.

**3. Cada sección carga sus propios datos.**

Si el armazón cargara los movimientos _y_ los planificados, habrías movido el
problema de sitio en vez de resolverlo. El armazón carga la cuenta —lo único
que es realmente suyo— y cada sección se ocupa de lo demás.

**4. Sale gratis un beneficio de rendimiento.**

Al ser rutas hijas, Angular puede cargarlas de forma **diferida** (_lazy
loading_): el navegador solo se descarga el código de la sección que abres. Los
planificados no pesan nada hasta que alguien entra en esa pestaña.

Esto no es la razón para hacerlo —la razón es no tener un god object— pero es
lo habitual: **una estructura honesta suele rendir mejor**, porque el bundler
puede separar lo que tú ya has separado.

## El contrato entre features

Una feature puede usar otra, pero **solo por su puerta principal**:

```ts
// bien
import { AccountTransactions } from '../../transactions';

// mal: entra en las tripas
import { AccountTransactions } from '../../transactions/pages/account-transactions/account-transactions';
```

La puerta es `features/<nombre>/index.ts`, un fichero que reexporta lo público.
En el mundo JavaScript a esto se le llama **barrel**.

### Qué se pone dentro

**Solo lo que otra feature necesita de verdad.** No es un listado de lo que hay
dentro: es la lista de lo que te comprometes a mantener.

Todo lo que entra ahí:

- deja de poder cambiar libremente, porque alguien más depende de ello,
- y lo pagan las demás features en tamaño de descarga.

Una feature que nadie usa no tiene `index.ts`. Se crea el día que otra la
necesita, y con lo mínimo.

**Señal de alarma:** si tres o más features importan del index de la misma
feature, eso ya no es una feature. Es `shared/` mal colocado, o un concepto que
pide su propio sitio.

### Por qué `core` no tiene barrel

Sería lo lógico por simetría, y es un error. Se midió, poniendo un
`core/index.ts` y usándolo desde una sola feature:

|                         | Sin barrel  | Con barrel   |
| ----------------------- | ----------- | ------------ |
| chunk `account-groups`  | 7.42 kB     | 7.59 kB      |
| chunk de rutas          | no existe   | 3.06 kB      |
| **total de la feature** | **7.42 kB** | **10.65 kB** |

Un barrel de **servicios** arrastra el grafo entero de core hasta quien lo
importe, y obliga al bundler a partir trozos de más. Un 43% más de descarga a
cambio de imports más cortos.

Y hay una razón de fondo: **un barrel sirve para esconder lo de dentro**. Core
no tiene nada que esconder — todos sus servicios son públicos por diseño. Un
barrel ahí no oculta nada, solo acopla.

De core se importa el servicio concreto:

```ts
import { AccountsService } from '../../../core/accounts/accounts.service';
```

`core/models.ts` **no es una excepción a esta regla, es otra cosa**: no existe
para acortar imports sino porque `api/` es privado y sus tipos no se pueden
alcanzar de otro modo. Y encima sale gratis, porque los tipos desaparecen al
compilar: medido, el bundle pesa lo mismo con y sin él.

Ese es el criterio para decidir si algo merece un fichero de reexportación:
**¿resuelve un problema de alcance, o solo escribe menos?** Lo primero vale la
pena; lo segundo se paga en acoplamiento y en kilobytes.

## Navegación: dos ámbitos

| Ámbito | Cómo se resuelve                    | Qué cuelga                     |
| ------ | ----------------------------------- | ------------------------------ |
| Grupo  | Ambiente, vía `GroupContextService` | `/cuentas`, `/categorias`      |
| Cuenta | Anidado en la URL                   | `/cuentas/:id` y sus secciones |

El grupo es **ambiente**: se elige una vez y se queda. Por eso no existe
`/grupos/:gid/cuentas/:aid/movimientos`, que sería la alternativa. En una
aplicación móvil donde casi siempre trabajas en el mismo grupo, repetirlo en
cada URL es ruido.

La cuenta sí va en la URL porque cambias de cuenta constantemente y quieres
poder volver a una concreta.

### Por qué `/grupos/:id` sí lleva id

Esa pantalla gestiona **un grupo cualquiera**, no necesariamente el de trabajo:
desde ahí se editan sus miembros y sus invitaciones sin tener que convertirlo
en el activo.

En cuanto una pantalla puede hablar de un grupo que no es el activo, el
contexto ya no puede expresar de cuál habla. **El contexto y la URL responden a
preguntas distintas**: el contexto dice _en qué grupo trabajo_, la URL dice
_qué grupo estoy mirando_. Antes coincidían siempre; desde que esa pantalla
existe, no.

**Consecuencia obligatoria:** en `/grupos/:id` todo se lee del id de ruta,
nunca del contexto. Leer el contexto ahí enseña datos del grupo equivocado sin
dar ningún error, que es la peor clase de fallo.

**Riesgo relacionado.** Los servicios de `core` guardan una sola signal plana
que se sobrescribe con cada carga. Mientras la pantalla de gestión use
servicios que solo ella usa (`group-members`, `invitations`) no hay problema.
El día que necesite cuentas o categorías de _otro_ grupo, ese estado tendrá que
indexarse por grupo.

## Cómo se mantiene

La dirección de las dependencias no se sostiene con buena voluntad. Se
comprueba:

```bash
npm run lint:boundaries
```

Recorre los imports de `src/app`, clasifica los dos extremos y falla si alguno
apunta donde no debe. Cubre las reglas de la tabla de capas, y además que una
feature no entre en las tripas de otra.

`.vscode/settings.json` saca `api/` de las sugerencias de importación
automática, para que no se cuele al escribir un tipo en una feature. Es un
disuasorio, no un candado: el guardia real es el comprobador.

## Estado actual

- El detalle de cuenta todavía no está partido en armazón y secciones.
- `features/accounts` sigue en esqueleto, sin adaptar al estilo del resto.
- `features/payment-plans` no existe todavía; su servicio en `core` sí.
