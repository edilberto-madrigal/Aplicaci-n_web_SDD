# Diario de Estudio

Aplicación web sencilla para registrar sesiones de estudio y seguir la constancia. Muestra las rachas, el tiempo estudiado durante la semana, los días activos del mes, un mapa de actividad reciente y el progreso hacia un objetivo semanal.

Está construida con HTML, CSS y JavaScript sin frameworks ni dependencias. Los datos se guardan en el navegador; no se necesita una cuenta, una conexión a internet ni un servidor.

## Requisitos

- Un navegador web moderno con JavaScript y almacenamiento local habilitados.
- Para ejecutar las pruebas: Node.js con el comando `node` disponible.

No hace falta instalar Node.js para usar la aplicación.

## Cómo abrirla

1. Descarga o descomprime la carpeta del proyecto.
2. Abre la carpeta y haz doble clic en `index.html`.
3. Si Windows pregunta con qué aplicación abrir el archivo, selecciona tu navegador.

También puedes abrir `index.html` desde el menú **Archivo → Abrir archivo** del navegador. La dirección comenzará con `file://`.

No ejecutes `npm install` ni busques un comando de inicio: el proyecto no usa npm, un servidor de desarrollo ni un paso de compilación.

## Cómo usarla

### Registrar una sesión

1. En **Registrar sesión**, selecciona la fecha.
2. Escribe el tema que estudiaste.
3. Indica los minutos de estudio.
4. Pulsa **Guardar sesión**.

La sesión aparecerá en la lista y las estadísticas se actualizarán. La fecha queda rellenada inicialmente con la fecha local de hoy; puedes cambiarla para registrar una sesión de otro día.

### Consultar las estadísticas

- **Racha actual:** días consecutivos con al menos una sesión. Si hoy todavía no has registrado una, la racha puede continuar desde ayer.
- **Mejor racha:** la secuencia más larga de días consecutivos con estudio.
- **Esta semana:** minutos registrados desde el lunes hasta hoy.
- **Días este mes:** cantidad de días distintos de este mes con al menos una sesión.
- **Semana:** indica qué días de la semana actual tienen sesiones; el borde ámbar identifica hoy.
- **Mapa de calor:** actividad diaria de las últimas ocho semanas hasta hoy. Al pasar el cursor sobre un día se muestra la fecha y sus minutos.

Las rachas y el mapa de calor no cuentan fechas futuras. La semana se calcula de lunes a domingo y las fechas usan el calendario local del usuario.

### Fijar un objetivo semanal

1. En **Objetivo semanal**, introduce una cantidad de minutos mayor que cero.
2. Pulsa **Guardar objetivo**.

La sección muestra el objetivo, los minutos acumulados desde el lunes y el porcentaje de cumplimiento. El porcentaje se limita al 100 %. El objetivo permanece guardado entre semanas; el progreso se calcula para la semana actual.

## Datos y privacidad

La aplicación guarda la información únicamente en el almacenamiento local del navegador (`localStorage`):

| Clave | Contenido |
| --- | --- |
| `diario-estudio-sesiones` | Lista de sesiones con fecha (`AAAA-MM-DD`), tema y minutos. |
| `diario-estudio-objetivo` | Minutos del objetivo semanal. |

Los datos no se envían a un servidor. Permanecen en el perfil del navegador donde abriste la aplicación; otro navegador o perfil puede mostrar un diario vacío. Borrar los datos del sitio o del navegador puede eliminar las sesiones y el objetivo. Si el historial es importante, conserva una copia antes de limpiar los datos del navegador.

## Estructura del proyecto

| Archivo o carpeta | Responsabilidad |
| --- | --- |
| `index.html` | Estructura de la página y carga de los scripts. |
| `styles.css` | Presentación y adaptación a pantallas pequeñas. |
| `app.js` | Formularios, almacenamiento, estadísticas y actualización de la interfaz. |
| `streak.js` | Cálculo de la racha actual y la mejor racha. |
| `heat-map.js` | Preparación de los datos del mapa de calor. |
| `tests/` | Pruebas automatizadas de las funciones de rachas y mapa de calor. |
| `specs/` | Especificaciones y planes de las funcionalidades. |
| `Docs/constitution.md` | Principios y restricciones del proyecto. |
| `AGENTS.md` | Convenciones e instrucciones de desarrollo. |

Los archivos JavaScript se cargan como scripts clásicos desde `index.html`; no se usan módulos ES ni solicitudes `fetch` a archivos locales. Esto permite abrir la aplicación directamente con `file://`.

## Ejecutar las pruebas

Desde la carpeta raíz del proyecto, ejecuta:

```text
node --test
```

Las pruebas cubren la lógica de fechas, rachas, validación y agregación de minutos del mapa de calor. No se necesita instalar paquetes.

## Limitaciones actuales

- Las sesiones se registran y consultan desde la interfaz; no hay controles para editarlas o borrarlas individualmente.
- El historial no se sincroniza entre navegadores o dispositivos.
- El mapa muestra las ocho semanas más recientes; no incluye controles para elegir otro período.

## Especificaciones

- [Rachas](./specs/002-streak/spec.md)
- [Mapa de calor](./specs/001-heat-map/spec.md)
- [Objetivo semanal](./specs/003-weekly-goal/spec.md)
