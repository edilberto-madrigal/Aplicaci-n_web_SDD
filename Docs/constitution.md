1. Simplicidad del stack: HTML, CSS y JavaScript puros; sin frameworks, npm, build ni servidor.
2. Relación spec-código: cada cambio debe corresponder a un requisito verificable y mantenerse alineado con AGENTS.md.
3. Separación clara: la interfaz no debe mezclar lógica, y la lógica no debe depender de la vista.
4. Política de pruebas: validar en Chrome DevTools, consola y móvil; sin instalar dependencias ni crear infraestructura.
5. Protección de datos: guardar solo en `localStorage` bajo `diario-estudio-sesiones` y nunca enviar información fuera del navegador.
6. Idioma y claridad: código y texto en español, nombres descriptivos y comentarios solo cuando aporten valor.
