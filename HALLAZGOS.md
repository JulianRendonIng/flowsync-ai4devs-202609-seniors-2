# Hallazgos

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- 0 filas, porque el cambio no toca datos. Medido con `select count(*)` sobre `backend/tmp/db.sqlite3`: 0 filas en `users`, `auth_access_tokens` y `tasks`, y 0 con `due_date` no nula.

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- Con PostgreSQL, ninguna tarea leída de la base aparece como vencida. Por ejemplo, si a una tarea le pones `dueDate` `2026-11-01`, la respuesta de `PUT /tasks/1/due-date` devuelve `isOverdue: true`, porque el objeto todavía guarda el string que recibió. Sin embargo, si después pides esa misma tarea con `GET /tasks/1?today=2026-11-18`, la respuesta devuelve `isOverdue: false`.
El motivo es que el driver `pg` convierte las columnas `DATE` en objetos `Date`. La comparación `this.dueDate < referenceDay` (`backend/app/models/task.ts:55`) enfrenta entonces un `Date` con un string, y el resultado siempre es `false`. Por eso, el comentario que habla de comparar «texto contra texto» ya no es cierto.
Ni las 23 pruebas ni el typecheck detectan el fallo. El typecheck pasa porque `schema_rules.ts` declara `dueDate` como `string`, así que `schema.ts` sigue tipando el campo como texto aunque la base devuelva un `Date`. Además, ninguna prueba vuelve a leer de la base una tarea con fecha.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

Queda por decidir si la corrección del tipo debe hacerse en el parser de `due_date`.