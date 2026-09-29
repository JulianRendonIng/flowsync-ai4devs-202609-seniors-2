# Prompts

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Revisa el código de este proyecto y hazme un resumen de lo que ya está implementado en el vertical de cuentas y acceso (registro, inicio de sesión, sesión y perfil).

Por favor, detalla lo que encuentres dividiéndolo en estas dos capas:

1. Back-end: Rutas (endpoints), controladores, modelo de usuario, validadores y middlewares (protección).
2. Front-end: Pantallas de acceso, manejo del estado de sesión y protección de rutas.

Describe únicamente el comportamiento actual y observable (peticiones/respuestas en el back y flujos visuales en el front). NO sugieras mejoras ni modifiques el código.
```

**Qué salió:** Me generó todo el contexto necesario desde las diferentes capas.


## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Tomando en cuenta el contexto generado del proyecto, redacta el contenido del archivo de especificación viva que debe guardarse en docs/spec-viva/ajrm.md

El formato es estricto y no negociable:
* Arriba, un `## Purpose` de una o dos frases: para qué existe esta capability.
* Debajo, `## Requirements`, y colgando de él `### Requirement:` en los que el sistema SHALL hacer algo.
* Bajo cada requisito, al menos un `#### Scenario:` de cuatro almohadillas, con dos viñetas: **WHEN** y **THEN**. No hay casilla para el GIVEN: la precondición se mete dentro del WHEN.
* En castellano, salvo las mayúsculas de la RFC.

Tres reglas duras:
* Nada de ADDED, MODIFIED ni REMOVED. Eso es el vocabulario de un delta, y esto no es un delta: es la verdad actual del sistema. Si tu archivo tiene una de esas secciones, has escrito otra cosa.
* Solo comportamiento observable desde fuera. Ni un nombre de clase, ni un nombre de archivo, ni una ruta de código. En la API, observable es la petición y la respuesta. En la pantalla, observable es lo que una persona ve y puede hacer.
* No toques el código. Ni siquiera para arreglar lo que encuentres.
```

**Qué salió:** Generó toda la spec viva asociada a las restricciones previamente emitidas pero no me generó las incoherencias por si sola.


## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Inspecciona el código e interfaces de este módulo para redactar la especificación del estado actual.

REGLAS DE IDENTIFICACIÓN DE BUGS Y DISCREPANCIAS:
1. Si encuentras un fallo, error o comportamiento inconsistente respecto a lo que debería hacer el sistema, dejalo en el chat tal y COMO OCURRE HOY EN EL CÓDIGO. No asumas ni documentes el comportamiento "correcto" que debería tener.
2. NO MODIFIQUES EL CÓDIGO. Está estrictamente prohibido corregir errores, refactorizar o alterar cualquier archivo del proyecto.
3. Reporta cada hallazgo por separado en el chat al finalizar la inspección, con la siguiente estructura:
   - Ubicación (archivo, función, endpoint o pantalla)
   - Comportamiento observado (lo que hace hoy el código)
   - Por qué se considera un bug o anomalía
```

**Qué salió:** Listo las incoherencias a nivel de auditoría, ya que por si solo no las mostró.
