# Spec: Objetivo Semanal de Estudio

## Descripción

Permitir al usuario fijar un objetivo de minutos de estudio por semana y visualizar cuánto lleva acumulado para motivarse a cumplirlo.

## Requisitos funcionales

### RF1: Establecer objetivo semanal
- El usuario puede fijar un objetivo de minutos semanal (número entero > 0).
- El objetivo se guarda en localStorage.
- Si ya existe un objetivo, se puede modificar.

### RF2: Mostrar progreso semanal
- Mostrar el objetivo actual (ej: "Objetivo: 300 min").
- Mostrar los minutos acumulados esta semana (ej: "Llevas: 180 min").
- Mostrar el porcentaje de cumplimiento (ej: "60%").
- Si no hay objetivo fijado, mostrar un mensaje invitando a fijar uno.

### RF3: Reset automático
- El progreso se resetea automáticamente cada lunes (nueva semana).
- El objetivo semanal permanece igual hasta que el usuario lo cambie.

### RF4: Persistencia
- El objetivo se guarda en localStorage y persiste al recargar.

## Reglas de negocio

- La semana empieza en lunes (convención del proyecto).
- El objetivo es el mismo para toda la semana; no cambia automáticamente.
- Los minutos acumulados se calculan desde el lunes de la semana actual hasta hoy.
- Las fechas futuras no suman.
- El objetivo debe ser un número entero mayor que 0.

## Casos límite

| Caso | Comportamiento esperado |
|------|------------------------|
| No hay objetivo fijado | Mostrar invitación para fijar uno |
| Objetivo = 0 o negativo | No guardar, mostrar error |
| Minutos acumulados > objetivo | Mostrar 100% (o más si se desea) |
| Cambio de semana (lunes) | Resetear minutos acumulados |
| Objetivo modificado | Aplicar desde la semana actual |

## Restricciones técnicas

- localStorage, clave: "diario-estudio-objetivo"
- Sin dependencias, sin build, funciona con file://
- Textos en español
- Fecha local del usuario (nunca UTC)
