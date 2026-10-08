# Prompts

---

## Prompt 1

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
Revisa la especificación en @openspec/specs/tasks/spec.md para la capability tasks, enfocándote en el requerimiento "Lo que cada tarea muestra de su responsable".

Registra en una tabla dentro de @docs/verificacion/ajrm.md los escenarios definidos y su correspondiente cobertura de tests. La tabla debe tener una fila por escenario y las siguientes 4 columnas:

  * El scenario, en una línea. Qué se espera y en qué situación. Si no cabe en una línea, es que estás juntando dos.

  * Qué test lo cubre, con el nombre exacto que aparece en la suite. Sin el nombre concreto, la columna va vacía: "seguro que algo lo cubre" no es una fila.

  * Cubierto · No cubierto · No lo sé. Los tres estados son válidos, y el tercero no es un fallo: es el resultado más informativo de los tres.

  * Si pusiste "no lo sé", qué te faltó para decidirlo. Media línea. Suele ser una de dos: no encontraste dónde se comprueba, o encontraste algo que se le parece y no dice exactamente lo mismo.

Adicional, encima, dos números: cuántos scenarios tiene el requisito y cuántos resultaron cubiertos.


Los tests que escribas van en backend/tests/functional/tasks/, siguiendo el estilo de los que ya hay en backend/tests/functional/auth/. No toques nada fuera de backend/tests/.
```

**Qué salió:** Generó todo lo solicitado.


## Prompt 2

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
Por cada fila en No cubierto, escribe el test que falta uno por scenario siguiendo el estilo de los que ya existen en el proyecto. Sin tocar nada fuera de la carpeta de tests. Cuando los tengas, ejecútalos, adicional, no arregles el código ni ajustes el test para que pase. Si algo se pone en rojo, se queda en rojo y se entrega en rojo: el objetivo es saber qué está mal, no ocultarlo. Quien verifica no arregla, porque quien arregla deja de ver.
```

**Qué salió:** Realizó las validaciones correspondientes y me marcó los test en rojo que no cumplían.
