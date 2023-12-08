const opciones = ["piedra", "papel", "tijera"];
let puntaje = JSON.parse(localStorage.getItem("puntaje")) || {
  ganadas: 0,
  perdidas: 0,
  empates: 0,
};
// Creamos un array para almacenar el historial de movimientos
const historialMovimientosUsuario = [];
const historialMovimientosComputadora = [];

// Actualiza el elemento HTML que muestra el puntaje
function actualizaPuntajeElemento() {
  document.querySelector(
    ".js-puntaje"
  ).innerHTML = `Ganadas: ${puntaje.ganadas}, Perdidas: ${puntaje.perdidas}, Empates: ${puntaje.empates}`;
}

// Función para que la computadora elija un movimiento aleatorio
function eligeMovimientoComputadora() {
  const eleccionComputadora =
    opciones[Math.floor(Math.random() * opciones.length)];
  //Se agrega, mediante la funcion push(), la eleccion de la computadora como un nuevo objeto al array creado historialMovimientos.
  historialMovimientosComputadora.push({
    jugador: "Computadora",
    eleccion: eleccionComputadora,
  });
  // Return para que el resultado pueda ser usado fuera del scope del condicional de la eleccionComputadora
  return eleccionComputadora;
}

// Función para mostrar las estadisticas
function mostrarEstadisticas() {
  const estadisticas = calcularEstadisticas(historialMovimientosUsuario);

  const estadisticasTexto = `
         Total de movimientos: ${estadisticas.totalMovimientos}<br>
         Porcentaje de victorias: ${estadisticas.porcentajeGanadas.toFixed(
           0
         )}%<br>
         Porcentaje de derrotas: ${estadisticas.porcentajePerdidas.toFixed(
           0
         )}%<br>
         Porcentaje de empates: ${estadisticas.porcentajeEmpates.toFixed(0)}%
     `;

  document.querySelector(".js-estadisticas").innerHTML = estadisticasTexto;
}

// Función para jugar al juego
function jugarJuego(eleccionUsuario) {
  const eleccionComputadora = eligeMovimientoComputadora();
  const relaciones = { piedra: "tijera", papel: "piedra", tijera: "papel" };
  // Esto determina el resultado de la ronda
  let resultado = "";
  if (eleccionUsuario === eleccionComputadora) {
    resultado = "EMPATE";
  } else if (relaciones[eleccionUsuario] === eleccionComputadora) {
    resultado = "GANASTE";
  } else {
    resultado = "PERDISTE";
  }

  // Actualiza el puntaje y muestra el resultado
  if (resultado === "GANASTE") {
    puntaje.ganadas += 1;
  } else if (resultado === "PERDISTE") {
    puntaje.perdidas += 1;
  } else {
    puntaje.empates += 1;
  }

  localStorage.setItem("puntaje", JSON.stringify(puntaje));
  actualizaPuntajeElemento();

  // Se agrega la elección del usuario al historial de movimientos
  const movimientoUsuario = {
    jugador: "Usuario",
    eleccion: eleccionUsuario,
    resultado: resultado,
  };
  historialMovimientosUsuario.push(movimientoUsuario);

  document.querySelector(".js-resultado").innerHTML = resultado;
  document.querySelector(".js-movimientos").innerHTML = `Vos
         <img src="./img/${eleccionUsuario.toLowerCase()}-emoji.png" class="mov-icon">
         <img src="./img/${eleccionComputadora.toLowerCase()}-emoji.png" class="mov-icon">
         Computadora`;

  mostrarEstadisticas();
}

// Reinicia el juego y muestra las estadisticas
function resetear() {
  puntaje = { ganadas: 0, perdidas: 0, empates: 0 };
  localStorage.setItem("puntaje", JSON.stringify(puntaje));
  actualizaPuntajeElemento();
  historialMovimientosUsuario.length = 0;
  historialMovimientosComputadora.length = 0;
  mostrarEstadisticas();
}

// Función para calcular estadisticas con método de orden superior sobre arrays
//Se utiliza filter para crear subconjuntos de elementos del array historialMovimientos basados en condiciones específicas.
function calcularEstadisticas(historialMovimientos) {
  const totalMovimientos = historialMovimientos.length;
  const ganadas = historialMovimientos.filter(
    (movimiento) => movimiento.resultado === "GANASTE"
  ).length;
  const perdidas = historialMovimientos.filter(
    (movimiento) => movimiento.resultado === "PERDISTE"
  ).length;
  const empates = historialMovimientos.filter(
    (movimiento) => movimiento.resultado === "EMPATE"
  ).length;

  const porcentajeGanadas = (ganadas / totalMovimientos) * 100 || 0;
  const porcentajePerdidas = (perdidas / totalMovimientos) * 100 || 0;
  const porcentajeEmpates = (empates / totalMovimientos) * 100 || 0;

  return {
    totalMovimientos,
    ganadas,
    perdidas,
    empates,
    porcentajeGanadas,
    porcentajePerdidas,
    porcentajeEmpates,
  };
}

// Event listeners para los botones
let piedraBtn = document.querySelector(".js-piedra-btn");
let papelBtn = document.querySelector(".js-papel-btn");
let tijeraBtn = document.querySelector(".js-tijera-btn");
let resetearBtn = document.getElementById("Resetear");

piedraBtn.addEventListener("click", () => jugarJuego("piedra"));
papelBtn.addEventListener("click", () => jugarJuego("papel"));
tijeraBtn.addEventListener("click", () => jugarJuego("tijera"));
resetearBtn.addEventListener("click", resetear);

actualizaPuntajeElemento();
