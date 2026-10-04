# MEMORY.md — Diario de Estudio

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual

- V1 funcionando y documentada en README.md: registro de sesiones, rachas, estadísticas, mapa de calor y objetivo semanal.
- Datos en localStorage.
- 18 tests unitarios pasando (`node --test`, heat-map + streak).

## Decisiones (y por qué)

- Sin backend ni dependencias: cualquiera debe poder abrirlo con doble clic.
- Fecha editable en el formulario: permite registrar días pasados y ver la racha crecer.
- Mejor racha calculada desde todas las sesiones guardadas: se actualiza automáticamente al registrar nuevas sesiones.
- Semana inicia en lunes: convención en países hispanohablantes. Minutos semanales = lunes a hoy, sin fechas futuras.
- Formato de minutos: "X h Y min" (ej. "5 h 40 min"), "0 min" si no hay sesiones.
- Días del mes: días únicos con sesión en el mes actual, sin fechas futuras.
- Diseño basado en criterios de dataviz (Tufte, Cairo, Lupi): hero ligero con contexto, small multiples para la semana, color con propósito, sin chartjunk.
- Lógica de rachas extraída a streak.js: permite tests unitarios sin navegador.
- Objetivo semanal: input + display de progreso con porcentaje. Clave localStorage: `diario-estudio-objetivo`.

## Aprendizajes y errores a evitar

- Verificado en navegador abriendo `index.html` directamente con `file://`: registra sesiones, guarda el objetivo, conserva ambos al recargar y no genera errores de consola.
- Verificado en vista móvil de 375px: la página no presenta desbordamiento horizontal.
- La lógica de fechas locales (`YYYY-MM-DD` desde `getFullYear()`, `getMonth()` y `getDate()`) evita desplazamientos por UTC.

## Próximos pasos

- Mantener la lógica de fechas y racha tal cual, y solo tocarla si cambia el requisito del proyecto.
- Cuando se quiera ampliar la app, revisar primero que no rompa localStorage ni la semántica de racha.
- Especificación definida para el mapa de calor: actividad reciente por semana, intensidad según minutos del día, ignorar fechas futuras y detalle al pasar el cursor.
