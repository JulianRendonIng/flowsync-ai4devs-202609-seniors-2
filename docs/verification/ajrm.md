# Verificación · tasks · «Lo que cada tarea muestra de su responsable»

Fuente: `openspec/specs/tasks/spec.md`, requisito «Lo que cada tarea muestra de su responsable».
Suite revisada: `backend/tests/` (Japa; solo existen `tests/functional/auth/*.spec.ts`). El frontend no tiene runner de tests.

- **Scenarios del requisito:** 3
- **Cubiertos:** 0

| Scenario | Test que lo cubre | Estado | Qué faltó para decidir |
|---|---|---|---|
| Una tarea cuyo responsable es "Ada Lovelace" trae en `assignee` ese nombre y sus iniciales. | | No cubierto | |
| Una tarea, suelta o en la lista, no trae en `assignee` el email ni datos de acceso. | | No cubierto | |
| Si el responsable se registró sin nombre, `assignee` trae nombre nulo e iniciales. | | No cubierto | |

Ningún test de la suite llama a `/api/v1/tasks` ni a `/api/v1/tasks/:id`. El parecido más cercano es `Auth | iniciales` › `sin nombre, las iniciales salen del email`, que comprueba las iniciales en la respuesta del login, no en el `assignee` de una tarea, y por eso no cuenta.
