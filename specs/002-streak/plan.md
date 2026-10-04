# Plan: Sistema de Rachas

## Estado actual

La lógica de rachas ya está implementada en `app.js`:
- `calcularRacha()` - racha actual
- `calcularMejorRacha()` - mejor racha histórica

## Tareas

1. [x] Implementar `calcularRacha()`
2. [x] Implementar `calcularMejorRacha()`
3. [x] Exhibir racha actual en la interfaz
4. [x] Exhibir mejor racha en la interfaz
5. [ ] Añadir tests unitarios para la lógica de rachas

## Notas

- La lógica de fechas sigue las reglas de `SKILLS.md` (local-dates).
- Las funciones son puras y dependen solo del array `sesiones`.
