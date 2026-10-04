# Plan de implementación: mapa de calor de estudio

## 1. Alcance y cumplimiento de la constitución

Este plan respeta la constitución del proyecto: mantiene HTML, CSS y JavaScript puros; separa lógica de interfaz; usa localStorage como fuente de verdad; evita dependencias; conserva textos y nombres en español; y no añade comportamiento fuera del requisito definido en la spec.

RF cubierto: RF-1, RF-2, RF-3, RF-4, RF-5, RF-6.

## 2. Archivos a crear o modificar

### 2.1 index.html
- Responsable de exponer la zona visual del mapa de calor dentro de la vista principal.
- Se añadirá una sección nueva para la grilla semanal y su contenedor de ayuda visual.
- Debe mantener el flujo actual del formulario y la lista de sesiones sin romper el contenido existente.
- RF cubierto: RF-1, RF-3, RF-5.

### 2.2 styles.css
- Responsable del estilo del mapa de calor, niveles de intensidad, estado sin actividad, hover y adaptación móvil.
- Debe priorizar legibilidad, contraste y sencillez visual para principiantes.
- RF cubierto: RF-1, RF-2, RF-5, requisitos no funcionales.

### 2.3 app.js
- Responsable de coordinar la carga de sesiones, el cálculo del rango temporal, la agregación por día, la transformación a intensidad, y la renderización final de la vista.
- Debe mantener la lógica separada de la capa visual para que la presentación dependa de estructuras de datos simples.
- RF cubierto: RF-1, RF-2, RF-3, RF-4, RF-5, RF-6.

### 2.4 tests/heat-map.test.js
- Responsable de validar las funciones puras del cálculo y la lógica de rango, sin depender del navegador.
- Se ejecutará con node --test y cubrirá la parte lógica más crítica del mapa.
- RF cubierto: RF-2, RF-3, RF-4, RF-6.

## 3. Funciones puras de lógica requeridas (con hoy como parámetro)

Las siguientes funciones deben permanecer puras y operativas con una fecha de referencia “hoy” como entrada explícita, para facilitar pruebas y evitar acoplarse al reloj del navegador.

- normalizarSesiones(sesiones): devuelve la lista segura, validada y sin fechas futuras.
  - RF cubierto: RF-4, RF-6.

- calcularRangoVisible(hoy, semanas): devuelve el inicio y fin del rango visible para la vista, con un valor por defecto consistente.
  - RF cubierto: RF-3.

- agregarMinutosPorDia(sesiones, inicio, fin): devuelve un mapa de fecha a total de minutos para ese periodo.
  - RF cubierto: RF-2, RF-6.

- construirDiasDelPeriodo(hoy, inicio, fin): devuelve la secuencia completa de días que deben mostrarse en la grilla.
  - RF cubierto: RF-1, RF-3.

- calcularIntensidadPorDia(totalMinutos, maximoDelPeriodo): devuelve el nivel de intensidad para cada día.
  - RF cubierto: RF-2.

- seleccionarColorPorIntensidad(nivel): devuelve la clase o valor visual asociado al nivel de intensidad.
  - RF cubierto: RF-2.

- construirTooltip(fecha, totalMinutos): genera el texto que se mostrará al pasar el cursor por la celda.
  - RF cubierto: RF-5.

- obtenerEstadoSinActividad(diasConDatos): devuelve el estado visual cuando no hay ninguna sesión en el período mostrado.
  - RF cubierto: RF-1.

## 4. Algoritmo del mapa (pseudocódigo)

1. Recibir el historial guardado en localStorage y la fecha de referencia hoy.
2. Normalizar las sesiones:
   - descartar entradas inválidas,
   - descartar fechas futuras,
   - agrupar por fecha local.
3. Definir el rango visible:
   - usar la ventana por defecto de semanas recientes,
   - si hay selector de rango, respetar la elección del usuario,
   - nunca incluir días futuros.
4. Generar la secuencia completa de días del rango visible, desde el primer día del primer lunes o inicio del bloque hasta el último día del bloque visible.
5. Para cada día del bloque:
   - sumar todos los minutos de las sesiones de esa fecha,
   - asignar valor numérico de intensidad,
   - marcar el día como activo o inactivo.
6. Calcular el máximo de minutos del período visible.
7. Para cada día activo, mapear la intensidad a un nivel visual según la escala proporcional.
8. En la capa de presentación:
   - pintar la grilla,
   - aplicar la clase o estilo según el nivel,
   - si hay actividad, mostrar el tooltip con la fecha y el total de minutos,
   - si no hay actividad, mostrar la grilla vacía con un estado claro.
9. Actualizar la vista cuando cambie la fecha de referencia o el rango seleccionado.

RF cubierto: RF-1, RF-2, RF-3, RF-4, RF-5, RF-6.

## 5. Cómo se pinta en la interfaz

### 5.1 Estructura visual
- La vista se integra como una grilla por semanas dentro del panel principal.
- Cada fila representa una semana y cada celda un día.
- La grilla debe ser compacta y legible en móvil, sin perder contexto.
- RF cubierto: RF-1, requisitos no funcionales.

### 5.2 Estado visual del día
- Si el día tiene 0 minutos, se pinta con un tono neutro.
- Si el día tiene minutos, el tono se hace más intenso a medida que aumenta el total.
- La diferencia de intensidad debe ser clara y gradual, sin saturar la vista.
- RF cubierto: RF-2.

### 5.3 Hover y detalle
- Al pasar el cursor sobre una celda con actividad, se muestra la fecha y el total de minutos del día.
- La celda inactiva no debe mostrar detalle de estudio.
- RF cubierto: RF-5.

### 5.4 Estado sin actividad
- Cuando el período no tiene sesiones, la grilla debe seguir siendo visible, pero con un estilo neutro y un texto breve de ayuda, en español.
- RF cubierto: RF-1, requisito no funcional de idioma y claridad.

## 6. Decisiones técnicas justificadas

### 6.1 Decisión: usar una escala proporcional al máximo del período visible
- Justificación: mantiene la comparación entre días dentro del mismo rango y evita que una semana “baja” se vea siempre igual que otra si el máximo cambia.
- Se alinea con un mapa de calor tipo GitHub y es más natural para personas que buscan patrones de continuidad.
- RF cubierto: RF-2.

Alternativa descartada: una escala fija con umbrales absolutos (por ejemplo, 0–30–60–120 minutos). Se descartó porque hace que la lectura del mismo comportamiento cambie cuando se cambia el rango de semanas y dificulta la comparación entre periodos.

### 6.2 Decisión: por defecto, mostrar una ventana reciente fija y permitir rango configurable
- Justificación: mantiene la interfaz simple para principiantes y cumple la idea de “últimas semanas” sin introducir complejidad innecesaria.
- Se mantiene compatible con la constitución de simplicidad y claridad.
- RF cubierto: RF-3.

Alternativa descartada: permitir fechas manuales complejas o un calendario de selección completa. Se descartó porque excede el alcance didáctico y aumenta la superficie de error en una app pequeña.

### 6.3 Decisión: calcular el total por día antes de pintar
- Justificación: la vista solo debe recibir datos ya agregados y listos para representar; así se evita mezclar lógica y presentación.
- RF cubierto: RF-2, RF-6.

Alternativa descartada: pintar cada sesión individualmente y luego sumar en el DOM. Se descartó porque introduce lógica visual y complica la validación de la consistencia.

### 6.4 Decisión: ignorar fechas futuras antes de cualquier cálculo visual
- Justificación: preserva la regla del proyecto y evita mostrar actividad que aún no existe.
- RF cubierto: RF-4.

Alternativa descartada: mostrar fechas futuras como pendientes. Se descartó porque reduce la fiabilidad del mapa y puede confundir al usuario.

## 7. Estrategia de tests con node --test

La estrategia de pruebas debe centrarse en las funciones puras, sin depender del DOM ni de Chrome DevTools para la lógica principal.

### 7.1 Cobertura mínima recomendada
- Rango visible: fechas futuras no forman parte del período mostrado.
- Total de minutos por día: varias sesiones del mismo día se suman correctamente.
- Estado sin actividad: cuando no hay datos, la estructura resultante refleja vacío.
- Intensidad: un día con más minutos produce nivel mayor que un día con menos minutos.
- Tooltip: el texto de detalle se genera con fecha y total de minutos correctos.
- Consistencia: la suma visual coincide con las sesiones guardadas.

RF cubierto: RF-2, RF-3, RF-4, RF-5, RF-6.

### 7.2 Qué validar en cada prueba
- fechas locales sin desplazamiento por UTC,
- rangos recientes correctos,
- suma por día en días con varias sesiones,
- caso de cero sesiones,
- caso de fechas futuras ignoradas,
- caso de cambio de rango visible.

### 7.3 Qué no se prueba aquí
- no se prueba la parte visual del navegador en estas pruebas unitarias,
- no se prueba la interacción real del hover en Node,
- esas comprobaciones quedan en la validación final con Chrome DevTools y móvil, como exige la constitución.

RF cubierto: RF-1, RF-5, requisitos no funcionales.

## 8. Matriz de cobertura por requisito funcional

- RF-1: secciones 2.1, 2.2, 3, 4, 5.1, 5.4, 7.3.
- RF-2: secciones 2.3, 3, 4, 5.2, 6.1, 7.1, 7.2.
- RF-3: secciones 2.1, 2.3, 3, 4, 6.2, 7.1, 7.2.
- RF-4: secciones 2.3, 3, 4, 6.4, 7.1, 7.2.
- RF-5: secciones 2.1, 2.3, 3, 5.3, 7.1, 7.2.
- RF-6: secciones 2.3, 3, 6.3, 7.1, 7.2.

## 9. Riesgos y control

- Riesgo principal: ampliar el mapa con más lógica de rango o escala sin necesidad. Se controla manteniendo la vista reciente y simple.
- Riesgo secundario: introducir complejidad en el DOM. Se controla calculando primero los datos agregados y luego pintando.
- Riesgo de inconsistencia: mezclar fechas futuras o almacenamiento corrupto. Se controla con validación previa y pruebas puras.

Este plan queda acotado a la funcionalidad pedida y evita desplazar el proyecto fuera de la constitución.
