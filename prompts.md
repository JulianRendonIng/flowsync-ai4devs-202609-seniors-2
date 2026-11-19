# Prompts
---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Migra este proyecto de SQLite a PostgreSQL ejecutado en Docker, con una base de datos para desarrollo y otra para pruebas.

## Antes de empezar
- Explora el repositorio para identificar el framework, el ORM o la capa de acceso a datos, cómo se cargan las variables de entorno y cómo se ejecutan las migraciones y las pruebas.
- Presenta un plan breve con los archivos que vas a crear o modificar y espera mi confirmación antes de aplicar cambios.

## Requisitos de Docker Compose
- El archivo se llama `compose.yaml` y define dos servicios: `db` (desarrollo) y `db-test` (pruebas).
- Ambos usan la imagen `pgvector/pgvector:pg17`.
- Expón `db` en el puerto 54410 del host y `db-test` en el 54411.
- La base de pruebas va en memoria, sin volumen. Así, los datos de una ejecución no quedan guardados para la siguiente.
- Configura una comprobación de salud en ambos servicios. El arranque debe esperar a que las dos bases acepten conexiones. En el primer arranque, PostgreSQL todavía está inicializando la base cuando otros procesos pueden intentar conectarse.
- No incluyas la clave `version:`; está obsoleta y Docker muestra un aviso.
- Haz que la batería de pruebas se conecte a la base de pruebas mediante su propio archivo de entorno. El framework lo carga solo en ese entorno.

## Makefile
- Añade atajos en el Makefile para arrancar y detener las bases, ejecutar las migraciones en ambas y lanzar las pruebas.

## Restricciones
- **No modifiques ninguna migración existente.** Si crees que alguna necesita cambios para funcionar en PostgreSQL (tipos, sintaxis específica de SQLite, etc.), detente y repórtamelo como hallazgo, indicando el archivo, el problema y la solución que propondrías. No continúes con ese punto sin mi aprobación.
- No toques código no relacionado con la migración.

```

**Qué salió:** Me pidió confirmar el plan y si aplicaba el parser a `due_date`.


## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Haz esta parte aunque la migración quede incompleta. Si las pruebas vuelven a pasar, sigue con estas tres comprobaciones y anota lo que observes.

Ejecuta la comprobación de tipos ((cd backend && npm run typecheck)) y anota si pasa o falla. Las dos respuestas son normales, y las dos enseñan algo.

Compara el archivo de tipos generado (backend/database/schema.ts) con el de la rama de partida. El diff puede mostrar declaraciones cambiadas o salir vacío, y las dos salidas son normales. Si hay cambios, indica qué declaraciones cambiaron de tipo y anota, para cada una, el tipo anterior y el nuevo. Si el diff está vacío, busca qué fija esos tipos al cambiar de motor: vacío no significa que no haya cambiado nada, sino que lo que cambió no está en lo que el proyecto declara.

Busca cómo decide el proyecto si una tarea está vencida. Lee el comentario que explica por qué funciona esa comparación y contrástalo con lo que encontraste en el paso anterior. Indica si sigue siendo válido y compruébalo con una tarea que ya debería estar vencida, no solo leyendo el código.
```

**Qué salió:** Funcionó a la primera.
