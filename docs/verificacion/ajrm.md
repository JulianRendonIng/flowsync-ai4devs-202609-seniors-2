# Verificación · tasks · «Lo que cada tarea muestra de su responsable»

Fuente: `openspec/specs/tasks/spec.md`, requisito «Lo que cada tarea muestra de su responsable».
Tests: `backend/tests/functional/tasks/assignee.spec.ts`, grupo `Tasks | responsable`. Cada scenario se comprueba por las dos lecturas que nombra la spec («suelta o dentro de la lista»): `GET /api/v1/tasks` y `GET /api/v1/tasks/:id`. En todos los tests, la tarea la crea una cuenta y la lee otra distinta, para que el `assignee` no se confunda con el perfil de quien pregunta.

- **Scenarios del requisito:** 3
- **Cubiertos:** 3 (uno de ellos con un test en rojo, ver abajo)

| Scenario | Test que lo cubre | Estado | Qué faltó para decidir |
|---|---|---|---|
| Una tarea cuyo responsable es "Ada Lovelace" trae en `assignee` ese nombre y sus iniciales. | `Tasks \| responsable` › `en la lista, el responsable llega con su nombre y sus iniciales` · `en la tarea suelta, el responsable llega con su nombre y sus iniciales` | Cubierto | |
| Una tarea, suelta o en la lista, no trae en `assignee` el email ni datos de acceso. | `Tasks \| responsable` › `en la lista, el responsable no trae el email ni datos de acceso` · `en la tarea suelta, el responsable no trae el email ni datos de acceso` | Cubierto (en rojo en la lista: el requisito no se cumple) | |
| Si el responsable se registró sin nombre, `assignee` trae nombre nulo e iniciales. | `Tasks \| responsable` › `en la lista, un responsable sin nombre llega con nombre nulo y sus iniciales` · `en la tarea suelta, un responsable sin nombre llega con nombre nulo y sus iniciales` | Cubierto | |

## Lo que han encontrado los tests

**`en la lista, el responsable no trae el email ni datos de acceso` falla.** La lista devuelve el `email` del responsable en cada tarea. La causa es que `backend/app/transformers/task_transformer.ts` serializa el `assignee` con `UserTransformer` (que incluye `email`, `createdAt` y `updatedAt`) en lugar de con `TaskAssigneeTransformer`, que es el que usa la tarea suelta y sí cumple. Por lectura de código, `TaskTransformer` también lo usan `POST /api/v1/tasks` y `PATCH /api/v1/tasks/:id/status`, así que esas respuestas filtrarían el email igual. No tienen test porque el scenario solo habla de la lista y de la tarea suelta. El arreglo queda fuera de este cambio porque toca código de `backend/app/`.

Matiz del requisito que el scenario no recoge: el texto del requisito dice que NO SHALL exponerse «ningún otro dato de esa cuenta» aparte del nombre y las iniciales, y `TaskAssigneeTransformer` devuelve además el `id` de la cuenta. El scenario solo prohíbe «el email ni ningún otro dato de acceso», y el `id` no es un dato de acceso, así que los tests no lo comprueban.


PARTE B

1. Cuántos scenarios creías cubiertos antes de mirar, y cuántos lo estaban.

   * Antes de mirar: 0.
   * Al terminar: 0.

2. El scenario en el que no supiste si faltaba un test o faltaba la regla en la spec.

    El escenario «Responsable identificable» carece de prueba y afirma que el nombre y las iniciales son «suficientes para identificar al encargado». Sin embargo, ninguna regla formal garantiza la unicidad entre cuentas, por lo que asumir esa capacidad de identificación es una suposición propia y no un requisito del spec.

3. Algo que el scenario no determinaba y tuviste que decidir al escribir el test.

    El test de «Responsable sin nombre» solo verifica que las iniciales no estén vacías, pero no valida su valor exacto ni comprueba si revelan parte del email.

