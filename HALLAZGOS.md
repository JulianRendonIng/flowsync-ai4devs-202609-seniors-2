# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- 0 filas, porque el cambio no toca datos. No añadí ninguna migración y no copié nada de SQLite. Medido con `select count(*)` sobre `backend/tmp/db.sqlite3`: 0 filas en `users`, `auth_access_tokens` y `tasks`, y 0 con `due_date` no nula. En PostgreSQL, después de migrar, también hay 0 en `users` y `tasks`. Revertir es volver al commit anterior sin perder datos. Ningún valor guardado cambia; lo que cambia es cómo se lee: `due_date` llega como `Date` (`2026-11-01T00:00:00.000Z`) y no como `'2026-11-01'`.

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- Con PostgreSQL ninguna tarea leída de la base sale vencida. Una tarea con `dueDate` `2026-11-01` da `isOverdue: true` en la respuesta de `PUT /tasks/1/due-date`, porque el objeto aún guarda el string recibido. La misma tarea da `isOverdue: false` en `GET /tasks/1?today=2026-11-18`. El driver `pg` devuelve el `DATE` como `Date`, y `this.dueDate < referenceDay` (`backend/app/models/task.ts:55`) compara un `Date` con un string: siempre sale `false`. Así, el comentario de «texto contra texto» deja de ser cierto. Ni las 23 pruebas ni el typecheck lo ven: el typecheck pasa porque `schema_rules.ts` fija `dueDate` como `string`, y por eso `schema.ts` no cambia frente a `s10/start`. Además, ninguna prueba vuelve a leer de la base una tarea con fecha.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- No pude levantar las bases en 54410 y 54411: Windows reserva el rango 54318–54417 (winnat). Lo verifiqué todo con un override temporal en 45410 y 45411, así que el `compose.yaml` real no ha arrancado en esta máquina. Tampoco comprobé con un `TZ` distinto de `UTC`. `pg` convierte el `DATE` en la medianoche local, y con un huso negativo sospecho que la fecha mostrada sería la del día anterior.
