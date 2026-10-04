# Spec: Sistema de Rachas

## Requisitos

### Racha actual
- Un día cuenta si tiene al menos una sesión registrada.
- La racha son los días consecutivos con sesión que terminan hoy.
- Si hoy no hay sesión pero ayer sí, la racha sigue viva y se cuenta desde ayer.
- Varias sesiones el mismo día cuentan como un solo día.
- Las fechas futuras no suman.

### Mejor racha
- Es la serie más larga de días consecutivos con sesión.
- No cuenta fechas futuras.
- Siempre es mayor o igual a la racha actual.

### Interfaz y accesibilidad
- La racha actual se muestra en grande con el emoji 🔥.
- La mejor racha se muestra como stat secundario.
- Contraste de color: texto oscuro (#1C1917) sobre fondo claro (#ffffff).
- Foco visible en inputs (outline ámbar de 2px).
- Vista móvil: diseño responsive sin scroll horizontal.
- ARIA: la sección de racha tiene `aria-label` descriptivo.

## Casos de prueba

| Escenario | Sesiones | Racha actual | Mejor racha |
|-----------|----------|--------------|-------------|
| Sin sesiones | `[]` | 0 | 0 |
| Solo hoy | `[hoy]` | 1 | 1 |
| Hoy y ayer | `[hoy, ayer]` | 2 | 2 |
| Ayer y anteayer (hoy sin sesión) | `[ayer, anteayer]` | 2 | 2 |
| Hueco en medio | `[hoy, ayer, anteayer-2]` | 2 | 2 |
| Fecha futura | `[hoy, mañana]` | 1 | 1 |
| Múltiples sesiones hoy | `[hoy, hoy]` | 1 | 1 |
| Cambio de semana (lunes) | `[lunes]` | 1 | 1 |
| Sesión inválida (minutos 0) | `[hoy(min:0)]` | 0 | 0 |

## Reglas de implementación

- Usar siempre fecha local del usuario.
- Nunca usar `toISOString()` ni `new Date("AAAA-MM-DD")`.
- Para sumar/restar días usar `setDate(getDate() ± n)`.
- Las sesiones con minutos <= 0 o fecha inválida se ignoran.
