# Plan: Objetivo Semanal de Estudio

## Estado actual

Ya existe `calcularMinutosSemana()` en `app.js` que calcula los minutos del lunes a hoy. Se reutilizará esta función.

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `index.html` | Añadir sección de objetivo semanal con input, botón y display de progreso |
| `styles.css` | Estilos para la nueva sección (coherentes con el diseño actual) |
| `app.js` | Nueva lógica: guardar/obtener objetivo, calcular porcentaje, renderizar progreso |

## Decisiones de implementación

- La sección de objetivo va entre la tarjeta de racha y el formulario de registro.
- Input numérico + botón "Guardar objetivo".
- Display: "Objetivo: X min | Llevas: Y min (Z%)".
- Si no hay objetivo: "Fija tu objetivo semanal" + input + botón.
- Clave localStorage: `diario-estudio-objetivo`.
- Validación: número entero > 0.

## Tareas

1. [ ] HTML: estructura de la sección de objetivo
2. [ ] CSS: estilos de la sección
3. [ ] JS: lógica de guardar/obtener objetivo y calcular porcentaje
4. [ ] JS: integración con renderizar()
5. [ ] Actualizar AGENTS.md y MEMORY.md
