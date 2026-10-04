# Especificación: mapa de calor de estudio

## Contexto y objetivo
El Diario de Estudio necesita una vista que permita identificar de un vistazo qué días han tenido más estudio en las últimas semanas. El objetivo es que el usuario comprenda rápidamente su continuidad de estudio, sin necesidad de revisar cada sesión individualmente.

## Usuarios
- Personas que registran sesiones de estudio y quieren ver patrones de continuidad.
- Personas que buscan motivación a partir de su hábito reciente.
- Personas principiantes en programación que necesitan una interfaz clara, simple y fácil de interpretar.

## Historias de usuario
- Como usuario, quiero ver en una sola vista los días estudiados de las últimas semanas para entender mi ritmo de estudio.
- Como usuario, quiero que los días con más minutos aparezcan más intensamente coloreados para identificar rápidamente los días más productivos.
- Como usuario, quiero que el sistema ignore fechas futuras para evitar mostrar actividad que aún no existe.
- Como usuario, quiero poder ver qué día tenía cuántos minutos cuando paso el cursor por una celda.
- Como usuario, quiero una vista sin actividad clara para saber que no hay estudio en ese periodo.

## Requisitos funcionales
### RF-1: visualización del mapa de calor
Cuando el usuario accede a la vista del mapa de calor, el sistema debe mostrar una grilla organizada por semanas con una celda por día del calendario.

Criterio de aceptación EARS:
- Cuando el usuario abre la vista del mapa de calor, entonces el sistema debe mostrar la actividad de las semanas recientes en una grilla legible y ordenada por fechas.
- Si no hay datos en el periodo mostrado, entonces el sistema debe mostrar la grilla vacía con un estado claro de ausencia de actividad.

### RF-2: cálculo de intensidad por día
Cuando el sistema calcula la intensidad de un día, debe sumar todos los minutos de las sesiones registradas para ese mismo día y asociar ese total a la intensidad visual de la celda.

Criterio de aceptación EARS:
- Cuando un día tiene una o varias sesiones, entonces el sistema debe sumar el total de minutos y usar ese valor para determinar la intensidad del color.
- Si un día no tiene sesiones, entonces el sistema debe mostrarlo con la intensidad mínima.
- La intensidad debe calcularse de forma proporcional al máximo de minutos del período visible para esta versión.

### RF-3: rango temporal reciente
Cuando el usuario entra en la vista, el sistema debe mostrar las últimas 8 semanas completas hasta hoy, sin incluir fechas futuras.

Criterio de aceptación EARS:
- Cuando el usuario abre la vista, entonces el sistema debe mostrar la actividad de las últimas 8 semanas completas hasta hoy.
- Si el día actual no tiene sesiones, la ventana sigue contando desde las 8 semanas anteriores hasta hoy sin incluir fechas futuras.
- En esta versión no se incluye navegación por rangos adicionales ni selección manual de semanas.

### RF-4: manejo de fechas futuras
Cuando una sesión o una fecha de estudio corresponde a un día futuro, el sistema no debe incluirla en el mapa de calor.

Criterio de aceptación EARS:
- Si una fecha registrada es futura, entonces el sistema debe ignorarla para el cálculo del mapa.
- Si el usuario intenta registrar o cargar una sesión con fecha futura, entonces el sistema no la debe contabilizar en la actividad visible.

### RF-5: detalle al pasar el cursor
Cuando el usuario pasa el cursor por una celda del mapa, el sistema debe mostrar la fecha y el total de minutos estudiados en ese día.

Criterio de aceptación EARS:
- Cuando el usuario se sitúa sobre una celda con actividad, entonces el sistema debe mostrar la fecha y el total de minutos del día.
- Si la celda no tiene actividad, entonces el sistema no debe mostrar un detalle de estudio.
- En esta versión, el detalle no incluye el número de sesiones del día.

### RF-6: consistencia con la historia de estudio
Cuando el usuario consulta el mapa, la información visual debe coincidir con los datos ya registrados en el diario y con el comportamiento general del proyecto.

Criterio de aceptación EARS:
- Cuando el usuario compara los datos del mapa con las sesiones registradas, entonces la suma de minutos por día debe coincidir con la actividad visible.
- Si el usuario registra una nueva sesión, entonces la vista debe actualizarse sin requerir recarga manual.

## Requisitos no funcionales
- La vista debe ser legible en móvil y en escritorio.
- La información debe estar en español y ser comprensible para alguien que empieza a programar.
- La interfaz debe mantener una sensación clara y motivadora, sin saturar visualmente al usuario.
- El comportamiento debe ser predecible y consistente con la lógica de rachas y fechas ya existente.
- La funcionalidad debe funcionar sin instalar dependencias ni servicios adicionales.

## Casos límite
- El usuario no tiene sesiones en el rango visible.
- El usuario registra varias sesiones en el mismo día con distintos temas.
- El usuario tiene actividad en días no consecutivos.
- El usuario tiene un rango reciente con pocas sesiones y un rango más antiguo con mucha más actividad.
- El historial incluye fechas futuras en datos antiguos o en casos de importación manual.
- El usuario cambia el rango de semanas a un período muy corto o muy largo.

## Fuera de criterios de finalización
- Añadir comparativas con otros usuarios o métricas agregadas.
- Añadir exportación de datos o descarga de imágenes.
- Añadir edición o borrado masivo de sesiones desde la vista del mapa.
- Añadir análisis predictivo o recomendaciones automáticas.
- Añadir filtros avanzados por tema o por rango personalizado con lógica compleja.

## Decisiones de la versión inicial
- La intensidad del color se calcula de forma proporcional al máximo de minutos del período visible.
- La vista por defecto muestra las últimas 8 semanas completas hasta hoy.
- El detalle al pasar el cursor muestra la fecha y el total de minutos del día.
- Esta versión no incluye navegación avanzada ni filtros adicionales.

