# Prompts

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Contrasta las reglas con los últimos 15 commits del repositorio y el estado actual de los archivos del proyecto y almacenas estos commits en una tabla. Guarda el resultado en docs/auditoria/ajrm.md, no en el chat.

Usa una fila por regla y completa estas cinco columnas:

* Qué pide la regla. Resúmela en una frase y con tus propias palabras. Si necesitas varias frases, puede que estés mezclando más de una regla.

* Qué se revisó para comprobarla. Indica el comando ejecutado o el archivo consultado. Sin esta información no hay forma de saber en qué se apoya el veredicto.

* Veredicto. Solo puede ser se cumple, no se cumple o no se puede comprobar con la información disponible. Este último caso también es un resultado válido. Significa que la regla no deja suficiente evidencia para verificarla.

* Evidencia. Escríbela en una línea. Si la regla no se cumple, indica dónde se incumple. Si no se puede comprobar, explica qué información falta.

* Qué harías con ella. Elige una opción: dejarla, borrarla o convertirla en una comprobación automática.

Anotaciones importantes: Esto es una auditoría, no una tarea de corrección, por lo tanto NO PUEDES modificar ningún archivo.

Validación Final Obligatoria:
Para ejecutar esta auditoría, es obligatorio que consultes el archivo Claude.md. No solo debes aplicar al pie de la letra la sección de reglas del proceso (las cuales son intocables y no puedes modificar bajo ninguna circunstancia), sino que también debes tener en cuenta toda la demás información y directrices que existen en ese mismo archivo, ya que son fundamentales para guiar tu análisis.
```

**Qué salió:** Generó todo lo solicitado, desde los analisis correspondientes, hasta la salida con la auditoría.
