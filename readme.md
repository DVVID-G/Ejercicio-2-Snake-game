# 🐍 Proyecto Final: Snake Game con Agente de Desarrollo (AI for Devs)

¡Bienvenido/a al desafío de desarrollo guiado por IA!

En este ejercicio, pondrás a prueba tus habilidades de **Prompt Engineering** para crear un juego funcional del clásico **Snake**. Tu rol no será escribir el código, sino **dirigir** al agente de desarrollo (tu herramienta de IA en el IDE) utilizando instrucciones claras y contextualizadas.

debes crear una carpeta en la raiz del proyecto con tu nombre y en su interior hacer el desarrollo del proyecto, una vez finalizado debes envíar un pull request.

## 🎯 Objetivo del Proyecto

Crear un juego Snake funcional, desplegable en web, siguiendo un ciclo de desarrollo completo (Planear, Actuar, Probar) y manteniendo el control del proyecto a través de comandos en lenguaje natural.

| Característica Clave | Detalle |
| :--- | :--- |
| **Tecnología** | Vanilla JavaScript, Canvas API para renderizado, HTML y CSS. |
| **Reglas** | Colisión con paredes/cuerpo = Game Over; crecimiento al comer fruta. |
| **Persistencia** | Guardado local (localStorage) de las 10 mejores puntuaciones (Highscores). |
| **Metodología** | Desarrollo 100% guiado por *prompts* (Lenguaje Natural). |

---

## 💡 Fase 1: Planeación y Contextualización (*Plan Mode*)

El objetivo es definir un contrato de trabajo claro para el agente, dándole el contexto necesario para que pueda proponer una solución técnica coherente.

### Guía para el Prompt Inicial

Tu primer *prompt* debe ser una **Definición de Requisitos y Arquitectura**. Debe contener:

| Elemento del Prompt | Descripción | Técnicas Sugeridas |
| :--- | :--- | :--- |
| **Contexto/Rol** | Define el objetivo del proyecto (crear un juego Snake) y el stack tecnológico deseado (Vanilla JS + Canvas). | Especificidad, Claridad. |
| **Requisitos Detallados** | Enumera las reglas del juego (aparición en el centro, crecimiento, colisiones, HUD, Top-10). | Criterios de Éxito, Límite de Puntuación (10). |
| **Output Solicitado** | Pide al agente que proponga 3 cosas: 1) Stack tecnológico, 2) Estructura de carpetas modular (`src/`), 3) Plan de Desarrollo (TODO List secuencial). | Restricción de Output (Lista, Estructura). |

---

## ✅ Fase 2: Revisión, Iteración y Regla de Contexto

Esta fase asegura que el agente no pierda el enfoque durante la implementación.

### Guía de Prompt para la Regla

Una vez que el plan del agente sea aceptado (o corregido por ti), debes fijar ese plan como una "Regla" o un contexto permanente.

| Elemento del Prompt | Descripción | Técnicas Sugeridas |
| :--- | :--- | :--- |
| **Confirmación** | Acepta la propuesta del agente (ej. "Excelente, este plan es viable."). | Refuerzo positivo. |
| **Creación de Regla** | Solicita explícitamente al agente que cree una **Regla de Contexto Concurrente** que mantenga el Plan de Desarrollo, la Estructura de Carpetas y el **Stack Tecnológico** definidos. | Persistencia, Memoria Contextual. |
| **Siguiente Paso** | Instruye al agente para que inicie la ejecución, siguiendo el primer punto de su propio **Plan de Desarrollo (TODO List)**. | Secuencialidad. |

---

## 🫡 Fase 3: Ejecución (*Act Mode*)

El agente comenzará a crear los archivos y a escribir el código según su propia lista de tareas. Tu rol se convierte en **Supervisor**.

* **Instruye al agente a avanzar:** Si el agente se detiene al terminar una tarea, indícale "Continúa con el siguiente paso de tu Plan de Desarrollo."
* **Revisa la modularidad:** Asegúrate de que el código se escriba en los archivos correctos (ej. Lógica de la serpiente en `snake.js`, no en `main.js`).

---

## 💻 Fase 4: Testing y Refinamiento (Iteración)

Cuando el agente declare que una funcionalidad está lista o que el juego es jugable, debes probarlo.

### Guía de Prompt para Debugging/Refinamiento

Si encuentras un error (*bug*) o falta una característica, utiliza un *prompt* específico de corrección. **Nunca edites el código manualmente.**

| Elemento del Prompt | Descripción | Técnicas Sugeridas |
| :--- | :--- | :--- |
| **Reporte de Error** | Describe exactamente qué está fallando y bajo qué condiciones (ej. "La colisión con la pared funciona, pero el choque con el propio cuerpo no detiene el juego"). | Claridad, Especificidad de la Falla. |
| **Localización (Opcional)** | Indica dónde crees que está la lógica del fallo (ej. "Revisa la función `checkSelfCollision` en `snake.js` o `game.js`"). | Guía de Archivo/Función. |
| **Acción Solicitada** | Pide al agente que diagnostique, corrija el código y te notifique una vez que la corrección esté implementada. | Solicitud de Acción Directa. |

---

## 🏁 Pasos Finales

Tu ejercicio estará completo cuando el agente haya implementado y probado todas las funcionalidades del Plan de Desarrollo y el juego cumpla con los **Criterios de Éxito** definidos en la Fase 1.

¡Comienza con tu primer prompt de planificación!