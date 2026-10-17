# Auditoría de reglas de `CLAUDE.md` contra el repositorio

- **Fecha:** 2026-10-17
- **Rama auditada:** `auditoria-ajrm` (apunta al mismo commit que `s5/start`, `eff1686`)
- **Alcance:** los últimos 15 commits (`git log -15`) y el estado actual del árbol de trabajo.
- **Naturaleza:** auditoría de solo lectura. No se ha modificado ningún archivo del proyecto; este informe es el único fichero creado. Los comandos que podían escribir (`npm test`, que usa el mismo SQLite que el dev server; `npm run dev`, que regenera `.adonisjs/`) no se ejecutaron.

## Commits auditados

| # | Hash | Fecha | Autor | Mensaje | Archivos tocados |
|---|---|---|---|---|---|
| 1 | `eff1686` | 2026-09-23 | LIDR-AI4Devs | docs: las instrucciones apuntan a los repos del cohorte 202609-seniors-2 | `README.md` |
| 2 | `21ce54d` | 2026-09-23 | Earvin Saúl Pérez Ramos | docs(s5): el README es la lección de ejercicio, generada | `README.md` |
| 3 | `afc4b74` | 2026-08-28 | LIDR Academy | docs(s5): enunciado del ejercicio y plantilla de prompts en la rama de partida | `README.md` |
| 4 | `cbe9617` | 2026-08-27 | Earvin Saúl Pérez Ramos | docs(tasks): el documento OpenAPI recoge el contrato que la spec exige | 3 controladores de tasks, `app/openapi/schemas.ts`, `config/openapi.ts`, `package.json`, `docs/capabilities/tasks/README.md` |
| 5 | `8f9e715` | 2026-08-24 | Earvin Saúl Pérez Ramos | chore(harness): el revisor adversarial contrasta contra la spec viva | `.claude/agents/adversarial-reviewer.md` |
| 6 | `160fbc7` | 2026-08-20 | Earvin Saúl Pérez Ramos | docs(process): el contrato de una capability se actualiza en el mismo commit | `CLAUDE.md` |
| 7 | `7662fb1` | 2026-08-20 | Earvin Saúl Pérez Ramos | docs(tasks): README de la capability, enlazando la spec en vez de copiarla | `docs/capabilities/tasks/README.md` |
| 8 | `c2fa70b` | 2026-08-20 | Earvin Saúl Pérez Ramos | docs(adr): los tests de integración pasan a ser la fuente de verdad ejecutable | `docs/adr/0001-…`, `docs/adr/0002-…` |
| 9 | `d789d5c` | 2026-08-20 | Earvin Saúl Pérez Ramos | docs(adr): registrar las delta-specs de OpenSpec como fuente de verdad viva | `docs/adr/0001-…` |
| 10 | `ea5db1f` | 2026-08-20 | Earvin Saúl Pérez Ramos | feat(openapi): registrar las rutas del documento y nombrar a FlowSync | 5 ficheros de `.adonisjs/`, `adonisrc.ts`, `config/openapi.ts`, `package*.json`, `start/routes.ts` |
| 11 | `190c80c` | 2026-08-20 | Earvin Saúl Pérez Ramos | docs(architecture): diagrama de contenedores C4 de FlowSync | `docs/architecture.md` |
| 12 | `4e03d1f` | 2026-08-20 | Earvin Saúl Pérez Ramos | fix(tasks): dejar de publicar el email del responsable en la lista | `app/transformers/task_transformer.ts` |
| 13 | `0e56705` | 2026-08-20 | Earvin Saúl Pérez Ramos | docs(process): la rama es por unidad de trabajo y el PR va una sola vez | `CLAUDE.md` |
| 14 | `4427afc` | 2026-08-20 | Earvin Saúl Pérez Ramos | test(tasks): cubrir con tests el responsable que muestra cada tarea | `tests/functional/tasks/assignee.spec.ts` |
| 15 | `b955a72` | 2026-08-28 | LIDR Academy | docs(s4): enunciado del ejercicio y plantilla de prompts en la rama de partida | `README.md` |

Historia lineal: ninguno de los 15 es un merge (`git log --merges -15` solo devuelve `9987cf0`, fuera del rango). Todos son alcanzables únicamente desde `s5/start`, `upstream/s4/end` y `upstream/s5/start` (`git branch -a --contains`).

## Reglas

### Reglas de proceso

| # | Qué pide la regla | Qué se revisó | Veredicto | Evidencia | Qué haría con ella |
|---|---|---|---|---|---|
| P1 | Si ya estás en una rama de trabajo, sigue en ella; solo desde `main` o una `sN/*` se crea una rama nueva. | `git branch --show-current`; `git branch -a` | Se cumple | Esta auditoría corre en `auditoria-ajrm`, rama de trabajo existente, y no se creó otra. | Dejarla |
| P2 | Las ramas nuevas se llaman `feat/<slug>`. | `git branch -a` | No se cumple | Ninguna rama de trabajo sigue el patrón: `auditoria-ajrm`, `origin/alcance-ajrm`, `origin/harness-ajr`, `origin/spec-viva-ajrm`, `origin/trazabilidad-ajrm`. | Convertirla en comprobación automática |
| P3 | No se commitea directamente en `main` ni en ninguna `sN/*`. | `git log -15 --format='%h %p'`; `git log --merges -15`; `git branch -a --contains <hash>` | No se cumple | `afc4b74` y `b955a72` dicen en su mensaje que van «en la rama de partida» y los 15 commits están en línea recta sobre `s4/end`→`s5/start`, sin merge ni rama de trabajo que los contenga. | Convertirla en comprobación automática |
| P4 | Se hace un commit por petición, usando la skill `/commit` (mensaje convencional `tipo(scope): descripción`). | `git log -15 --format='%s'`; `.claude/skills/commit/SKILL.md` | No se puede comprobar con la información disponible | Los 15 mensajes tienen formato convencional, pero git no registra qué petición originó cada commit ni si se usó la skill. | Convertirla en comprobación automática (commitlint para el formato) |
| P5 | Si un cambio toca rutas, controladores, validadores o transformers de una capability, el mismo commit actualiza el diff de `.adonisjs/` y `docs/capabilities/<nombre>/README.md`. | `git log -15 --name-status`; `git diff --ignore-cr-at-eol --stat backend/.adonisjs` | Se cumple | Desde que existe la regla (`160fbc7`), el único commit afectado es `cbe9617`, que incluye el README de tasks; `.adonisjs/` regenerado no cambia salvo finales de línea. | Convertirla en comprobación automática |
| P6 | Al terminar la unidad de trabajo, y solo entonces, se abre un PR con `gh pr create` y una descripción completa. | `gh pr list -R LIDR-academy-temp/… --state all`; `gh pr list -R JulianRendonIng/… --state all` | No se puede comprobar con la información disponible | Ningún PR de los dos repos contiene estos commits (solo existen los PR #1 y #2, de otras ramas); vienen de un repo de diseño externo cuyos PR no están accesibles. | Convertirla en comprobación automática |
| P7 | Lo último antes de cerrar la unidad es pasar el subagente `adversarial-reviewer` sobre el PR. | `.claude/agents/adversarial-reviewer.md`; `gh pr list` | No se puede comprobar con la información disponible | El agente existe, pero su revisión no deja rastro ni en el repo ni en los PR. | Convertirla en comprobación automática (que deje un comentario en el PR) |
| P8 | Al abrir el PR, la respuesta en el chat es solo su URL. | `CLAUDE.md` (reglas de proceso) | No se puede comprobar con la información disponible | Pasa en la sesión de chat, que no se guarda en el repo. | Dejarla |

### Resto de directrices de `CLAUDE.md`

| # | Qué pide la regla | Qué se revisó | Veredicto | Evidencia | Qué haría con ella |
|---|---|---|---|---|---|
| D1 | `database/schema.ts` lo genera `migration:run` y no se edita a mano. | `head -5 backend/database/schema.ts`; `git log -- backend/database/schema.ts`; `git diff --ignore-cr-at-eol` | Se cumple | Ninguno de los 15 commits lo toca y la copia de trabajo solo difiere en finales de línea (la única edición manual, `b162522`, quedó revertida en `775c1ff`, ambas fuera del rango). | Convertirla en comprobación automática |
| D2 | Los modelos heredan las columnas del esquema generado y no las declaran. | `grep -nE "@column\|extends" backend/app/models/*.ts` | Se cumple | `Task extends TaskSchema` y `User extends compose(UserSchema, …)`, sin `@column`. | Convertirla en comprobación automática |
| D3 | `backend/.adonisjs/` se versiona y se commitea regenerado. | `git ls-files backend/.adonisjs`; `git check-ignore`; `git diff --ignore-cr-at-eol --stat` | Se cumple | Hay 9 ficheros versionados y no ignorados; `ea5db1f` commitea el diff de las rutas nuevas y el contenido actual coincide con el commiteado. | Convertirla en comprobación automática |
| D4 | Toda respuesta de controlador sale por `serialize()` y con un transformer. | `grep -nE "return \|serialize" backend/app/controllers/*.ts` | No se cumple | `backend/app/controllers/access_tokens_controller.ts:25` (`destroy`) devuelve `{ message }` sin `serialize()`. | Dejarla |
| D5 | Los validadores usan `vine.create` y comparten builders de campo. | `grep -rn "vine\.(create\|compile)" backend/app/validators`; `backend/app/validators/user.ts:6-7` | Se cumple | Los 7 validadores usan `vine.create`, sin `vine.compile`, y `email()`/`password()` se comparten. | Convertirla en comprobación automática |
| D6 | En el backend se importa por subpath (`#…`) y no por ruta relativa. | `grep -rnE "from '\.\.?/" backend/{app,start,config,database,tests,providers}`; `backend/package.json` (`imports`) | Se cumple | Solo `tests/bootstrap.ts:10` importa por ruta relativa, y es porque `#generated/*` mapea a `.adonisjs/server`, no a `client/`. | Convertirla en comprobación automática |
| D7 | Las variables de entorno se añaden con `node ace env:add`, que actualiza `.env`, `.env.example` y `start/env.ts`. | `backend/.env.example`; `backend/start/env.ts` | No se puede comprobar con la información disponible | Git no registra qué comando se usó y ningún commit del rango toca variables; hoy `.env.example` y `start/env.ts` son coherentes. | Convertirla en comprobación automática (que `.env.example` y `start/env.ts` declaren las mismas claves) |
| D8 | Los tests que escriben en BD se aíslan con `testUtils.db()`. | `grep -rn "testUtils" backend/tests` | Se cumple | Los 5 spec (4 de auth y `tasks/assignee.spec.ts`) usan `group.each.setup(() => testUtils.db().withGlobalTransaction())`. | Convertirla en comprobación automática |
| D9 | En el frontend, las llamadas a la API solo se hacen desde `src/lib/api.ts`. | `grep -rn "fetch(" frontend/src` excluyendo `lib/api.ts` | Se cumple | No hay ningún `fetch(` fuera de `src/lib/api.ts`. | Convertirla en comprobación automática |
| D10 | Los componentes de `src/components/ui/` se traen con shadcn y no se editan a mano. | `git log -- frontend/src/components/ui` | Se cumple | Ninguno de los 15 commits los toca; el único commit que los ha modificado es `6b255ec`, el que los añadió. | Convertirla en comprobación automática |
| D11 | El frontend se formatea con Prettier y un hook `PostToolUse` lo aplica a cada fichero editado. | `.claude/settings.json`; `npx prettier --check --end-of-line auto .`; `npx oxlint` | Se cumple | El hook existe y Prettier/oxlint pasan sin avisos (sin `--end-of-line auto` salen 39 avisos, todos por el CRLF de `core.autocrlf=true`). | Dejarla |
| D12 | El alias `@/*` se declara en `tsconfig.app.json` sin `baseUrl` y también en `vite.config.ts`. | `grep baseUrl\|@/* frontend/tsconfig*.json`; `frontend/vite.config.ts` | Se cumple | `tsconfig.app.json:13` declara el alias sin `baseUrl` y `vite.config.ts:11` lo repite. | Dejarla |
| D13 | `auth/auth-context.ts` solo contiene el contexto, sin componentes. | `frontend/src/auth/auth-context.ts` | Se cumple | Solo exporta tipos y `createContext`; oxlint pasa con `react/only-export-components`. | Borrarla |
| D14 | Las descripciones de `CLAUDE.md` coinciden con el estado actual del repo. | `ls backend/tests/functional`; `node ace list:routes`; tabla de rutas de `CLAUDE.md` | No se cumple | Dice que `tasks` no tiene tests (existe `tests/functional/tasks/assignee.spec.ts`, de `4427afc`) y lista 4 rutas cuando hay 9 en `/api/v1` más `/api`, `/api.json` y `/api.yaml`. | Dejarla |
| D15 | Antes de dar por buena una firma de AdonisJS 7, Lucid 22 o VineJS 4, se revisan los `.d.ts` instalados. | `CLAUDE.md` (sección de versiones) | No se puede comprobar con la información disponible | Es una práctica de quien escribe el código y no deja rastro en commits ni ficheros. | Dejarla |

## Observaciones

1. **El árbol de trabajo no tiene cambios reales.** Los 11 ficheros que `git status` marca como modificados (`.adonisjs/*`, `.env.example`, `database/schema.ts`) solo difieren en LF/CRLF: `git diff --ignore-cr-at-eol --stat` sale vacío. Es lo que pasa al regenerarlos en Windows con `core.autocrlf=true`.
2. **`AGENTS.md` no funciona como symlink en esta copia.** El commit `0e56705` lo da por cubierto porque es un symlink a `CLAUDE.md` (modo `120000` en el índice), pero aquí `core.symlinks=false` y el fichero es un texto de 9 bytes que contiene `CLAUDE.md`. Un agente que lea `AGENTS.md` en Windows no ve las reglas.
3. **El commit `cbe9617` deja un incumplimiento documentado a propósito.** Anota que `listTasksValidator` usa `vine.string()` en lugar de `vine.enum` y que eso choca con la spec. Se registra en el README en lugar de corregirse. Afecta a la spec, no a las reglas de `CLAUDE.md`.
4. **Varias reglas se pueden automatizar.** Una sola job de CI comprobaría P2, P3, P5, D1, D3 y D6: regenerar `.adonisjs/` y `schema.ts` y fallar con `git diff --exit-code`, aplicar `eslint no-restricted-imports` y una protección de rama sobre `main` y `s*/*`.

## Comandos ejecutados (todos de solo lectura)

```bash
git branch --show-current; git status --short; git branch -a
git log -15 --format='%h|%an|%ad|%s' --date=short
git log -15 --name-status; git log -15 --format='%h %p'; git log --merges -15
git branch -a --contains <hash>
git diff --stat; git diff --ignore-cr-at-eol --stat
git log -- backend/database/schema.ts | backend/database/migrations | frontend/src/components/ui
git ls-files backend/.adonisjs; git check-ignore -v …; git ls-files -s AGENTS.md; git config core.symlinks core.autocrlf
gh pr list -R LIDR-academy-temp/flowsync-ai4devs-202609-seniors-2 --state all
gh pr list -R JulianRendonIng/flowsync-ai4devs-202609-seniors-2 --state all
grep (imports relativos, serialize, @column, vine.create, testUtils, fetch, baseUrl)
cd backend && node ace list:routes && npm run lint && npm run typecheck   # lint y typecheck en verde
cd frontend && npx oxlint && npx prettier --check --end-of-line auto .    # en verde
```

## Parte B

1. **La regla en la que la auditoría más se desvió de su expectativa inicial fue P3, la de no commitear directamente en `main` ni en una `sN/*`.** Al empezar se esperaba marcarla como «no se puede comprobar», porque git no guarda en qué rama nace cada commit. Pero la historia es una línea recta, sin merges ni ramas de trabajo que contengan esos commits. Además, `afc4b74` y `b955a72` lo dicen en su propio mensaje: van «en la rama de partida». Aquella expectativa era más una intuición que un análisis, y los mensajes de los commits la desmintieron.

2. **La regla que la auditoría no pudo comprobar fue P7, la de pasar el `adversarial-reviewer` sobre el PR.** Hoy esa revisión no deja huella en ningún sitio, así que no hay forma de saber si se hizo. Bastaría con que el subagente dejara su veredicto como comentario o como check en el PR, y con que la protección de rama exigiera ese check antes de fusionar.

3. **La regla que la auditoría propone eliminar es D13: que `auth/auth-context.ts` tenga solo el contexto, sin componentes.** Es una regla que ya vigila otra herramienta. La regla `react/only-export-components` de oxlint falla en cuanto alguien mezcla un componente en ese fichero. Tenerla también en `CLAUDE.md` no añade ningún control y solo ocupa contexto.
