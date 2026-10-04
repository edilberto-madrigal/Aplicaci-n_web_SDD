// Clave donde guardamos las sesiones en localStorage
const CLAVE_LOCALSTORAGE = "diario-estudio-sesiones";

// Elementos del DOM
const formulario = document.getElementById("formulario");
const campoFecha = document.getElementById("fecha");
const campoTema = document.getElementById("tema");
const campoMinutos = document.getElementById("minutos");
const rachaElemento = document.getElementById("racha");
const mejorRachaElemento = document.getElementById("mejor-racha");
const minutosSemanaElemento = document.getElementById("minutos-semana");
const diasMesElemento = document.getElementById("dias-mes");
const semanaElemento = document.getElementById("semana");
const heatmapElemento = document.getElementById("heatmap");
const heatmapEstadoElemento = document.getElementById("heatmap-estado");
const objetivoTextoElemento = document.getElementById("objetivo-texto");
const formularioObjetivo = document.getElementById("formulario-objetivo");
const inputObjetivo = document.getElementById("input-objetivo");
const listaSesiones = document.getElementById("lista-sesiones");

// Cargar las sesiones guardadas (o empezar con lista vacía)
let sesiones = cargarSesiones();

// La fecha de hoy en formato local YYYY-MM-DD
campoFecha.value = obtenerFechaLocal(new Date());

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const fecha = campoFecha.value;
  const tema = campoTema.value.trim();
  const minutos = Number(campoMinutos.value);

  // Validaciones simples
  if (!fecha) {
    alert("Elige una fecha.");
    return;
  }
  if (tema === "") {
    alert("Escribe el tema.");
    return;
  }
  if (!Number.isFinite(minutos) || minutos <= 0) {
    alert("Los minutos deben ser un número mayor que 0.");
    return;
  }

  sesiones.push({ fecha: fecha, tema: tema, minutos: minutos });
  guardarSesiones();
  renderizar();

  // Limpiar solo tema y minutos para registrar otra sesión seguida
  campoTema.value = "";
  campoMinutos.value = "";
  campoTema.focus();
});

function cargarSesiones() {
  const datos = localStorage.getItem(CLAVE_LOCALSTORAGE);
  if (!datos) return [];
  try {
    return JSON.parse(datos);
  } catch (e) {
    return [];
  }
}

function guardarSesiones() {
  localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(sesiones));
}

// Devuelve la fecha local como texto YYYY-MM-DD (nunca UTC)
function obtenerFechaLocal(fecha) {
  return StreakLogic.toLocalDateKey(fecha);
}

// Calcula la racha actual usando la lógica extraída
function calcularRacha() {
  return StreakLogic.calculateStreak(sesiones);
}

// Calcula la mejor racha usando la lógica extraída
function calcularMejorRacha() {
  return StreakLogic.calculateBestStreak(sesiones);
}

// Calcula el total de minutos estudiados esta semana (lunes a hoy)
function calcularMinutosSemana() {
  const hoy = new Date();

  // Encontrar el lunes de esta semana
  const diaSemana = hoy.getDay(); // 0=domingo, 1=lunes, ..., 6=sábado
  const diasDesdeLunes = (diaSemana + 6) % 7;
  const lunes = new Date(hoy);
  lunes.setDate(lunes.getDate() - diasDesdeLunes);

  const fechaLunes = obtenerFechaLocal(lunes);
  const fechaHoy = obtenerFechaLocal(hoy);

  let totalMinutos = 0;
  for (const sesion of sesiones) {
    if (sesion.fecha >= fechaLunes && sesion.fecha <= fechaHoy) {
      totalMinutos += sesion.minutos;
    }
  }

  return totalMinutos;
}

// Formatea minutos como "X h Y min", "X h" o "Y min"
function formatearMinutos(minutos) {
  if (minutos === 0) return "0 min";
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  if (horas === 0) return `${mins} min`;
  if (mins === 0) return `${horas} h`;
  return `${horas} h ${mins} min`;
}

// Calcula los días únicos estudiados este mes (sin fechas futuras)
function calcularDiasMes() {
  const hoy = new Date();
  const anioActual = hoy.getFullYear();
  const mesActual = hoy.getMonth();
  const fechaHoy = obtenerFechaLocal(hoy);

  const diasUnicos = new Set();
  for (const sesion of sesiones) {
    if (sesion.fecha > fechaHoy) continue; // ignorar fechas futuras
    const [anio, mes] = sesion.fecha.split("-").map(Number);
    if (anio === anioActual && mes === mesActual + 1) {
      diasUnicos.add(sesion.fecha);
    }
  }

  return diasUnicos.size;
}

// Renderiza los 7 días de la semana como puntos (small multiples)
function renderizarSemana() {
  const diasConSesion = new Set(sesiones.map((s) => s.fecha));
  const hoy = new Date();
  const diaSemana = hoy.getDay(); // 0=domingo, 1=lunes, ..., 6=sábado
  const diasDesdeLunes = (diaSemana + 6) % 7;
  const lunes = new Date(hoy);
  lunes.setDate(lunes.getDate() - diasDesdeLunes);

  const nombresDias = ["L", "M", "X", "J", "V", "S", "D"];
  semanaElemento.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    const fecha = new Date(lunes);
    fecha.setDate(fecha.getDate() + i);
    const fechaStr = obtenerFechaLocal(fecha);
    const esHoy = fechaStr === obtenerFechaLocal(hoy);
    const tieneSesion = diasConSesion.has(fechaStr);

    const punto = document.createElement("div");
    punto.className = "dia-semana";
    punto.textContent = nombresDias[i];
    if (tieneSesion) punto.classList.add("activo");
    if (esHoy) punto.classList.add("hoy");
    semanaElemento.appendChild(punto);
  }
}

function renderizarMapaCalor() {
  const datos = HeatMapLogic.buildHeatMapData({
    sessions: sesiones,
    today: new Date(),
    weeks: 8,
  });

  heatmapElemento.innerHTML = "";
  heatmapEstadoElemento.textContent = "Sin actividad reciente";

  const totalMinutos = Object.values(datos.byDay).reduce((total, valor) => total + valor, 0);

  for (const fecha of datos.days) {
    const celda = document.createElement("div");
    const totalDia = datos.byDay[fecha] || 0;
    const nivel = datos.levels[fecha] || 0;
    celda.className = `heatmap-dia intensidad-${nivel}`;
    celda.title = totalDia > 0 ? `${fecha}: ${totalDia} min` : `${fecha}: sin estudio`;
    celda.setAttribute("aria-label", totalDia > 0 ? `${fecha}: ${totalDia} minutos estudiados` : `${fecha}: sin estudio`);
    heatmapElemento.appendChild(celda);
  }

  if (totalMinutos > 0) {
    heatmapEstadoElemento.textContent = "Últimas 8 semanas";
  }
}

// Clave para guardar el objetivo semanal
const CLAVE_OBJETIVO = "diario-estudio-objetivo";

// Guarda el objetivo semanal en localStorage
function guardarObjetivo(minutos) {
  localStorage.setItem(CLAVE_OBJETIVO, String(minutos));
}

// Obtiene el objetivo semanal (null si no existe)
function obtenerObjetivo() {
  const valor = localStorage.getItem(CLAVE_OBJETIVO);
  if (!valor) return null;
  const minutos = Number(valor);
  return Number.isFinite(minutos) && minutos > 0 ? minutos : null;
}

// Renderiza la sección de objetivo semanal
function renderizarObjetivo() {
  const objetivo = obtenerObjetivo();
  const minutosSemana = calcularMinutosSemana();

  if (!objetivo) {
    objetivoTextoElemento.textContent = "Fija tu objetivo semanal";
    formularioObjetivo.style.display = "flex";
    return;
  }

  formularioObjetivo.style.display = "none";
  const porcentaje = Math.min(100, Math.round((minutosSemana / objetivo) * 100));

  objetivoTextoElemento.innerHTML = "";
  const textoBase = document.createElement("span");
  textoBase.textContent = `Objetivo: ${formatearMinutos(objetivo)}`;
  objetivoTextoElemento.appendChild(textoBase);

  const progreso = document.createElement("span");
  progreso.className = "progreso";
  progreso.textContent = `Llevas: ${formatearMinutos(minutosSemana)}`;
  objetivoTextoElemento.appendChild(progreso);

  const porcentajeEl = document.createElement("span");
  porcentajeEl.className = "porcentaje";
  porcentajeEl.textContent = `${porcentaje}% cumplido`;
  objetivoTextoElemento.appendChild(porcentajeEl);
}

// Evento del formulario de objetivo
formularioObjetivo.addEventListener("submit", function (evento) {
  evento.preventDefault();
  const minutos = Number(inputObjetivo.value);

  if (!Number.isFinite(minutos) || minutos <= 0) {
    alert("El objetivo debe ser un número mayor que 0.");
    return;
  }

  guardarObjetivo(Math.round(minutos));
  inputObjetivo.value = "";
  renderizarObjetivo();
});

function renderizar() {
  // Racha actual
  const racha = calcularRacha();
  rachaElemento.textContent = racha;

  // Mejor racha
  const mejorRacha = calcularMejorRacha();
  mejorRachaElemento.textContent = mejorRacha;

  // Minutos esta semana
  const minutosSemana = calcularMinutosSemana();
  minutosSemanaElemento.textContent = formatearMinutos(minutosSemana);

  // Días estudiados este mes
  const diasMes = calcularDiasMes();
  diasMesElemento.textContent = diasMes;

  // Visualización de la semana
  renderizarSemana();

  // Mapa de calor
  renderizarMapaCalor();

  // Objetivo semanal
  renderizarObjetivo();

  // Lista de sesiones: de la más reciente a la más antigua
  const ordenadas = [...sesiones].sort((a, b) => {
    if (a.fecha < b.fecha) return 1;
    if (a.fecha > b.fecha) return -1;
    return 0;
  });

  listaSesiones.innerHTML = "";
  if (ordenadas.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Todavía no hay sesiones registradas.";
    listaSesiones.appendChild(item);
    return;
  }

  for (const sesion of ordenadas) {
    const item = document.createElement("li");
    item.textContent = `${sesion.fecha} — ${sesion.tema} (${sesion.minutos} min)`;
    listaSesiones.appendChild(item);
  }
}

renderizar();
