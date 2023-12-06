function actualizaPuntajeElemento() {
  document.querySelector(
    ".js-puntaje"
  ).innerHTML = `Ganadas: ${puntaje.ganadas}, Perdidas: ${puntaje.perdidas}, Empates: ${puntaje.empates}`;
}
// Creamos un objeto para almacenar el puntaje y lo guardamos en una variable
//Guardamos con localStorage
let puntaje = JSON.parse(localStorage.getItem("puntaje")) || {
  ganadas: 0,
  perdidas: 0,
  empates: 0,
};
/* Este codigo es lo mismo que arriba dsp del ||
if (!puntaje) {
    puntaje = {
        ganadas: 0,
        perdidas: 0,
        empates: 0,
    }*/
actualizaPuntajeElemento();

// Creamos un array para almacenar el historial de movimientos
const historialMovimientosUsuario = [];
const historialMovimientosComputadora = [];

function eligeMovimientoComputadora() {
  const randomNumber = Math.random();
  let eleccionComputadora = "";

  // Acá se genera una elección al azar para la computadora
  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    eleccionComputadora = "piedra";
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    eleccionComputadora = "papel";
  } else if (randomNumber >= 2 / 3 && randomNumber < 1) {
    eleccionComputadora = "tijera";
  }

  //Se agrega, mediante la funcion push(), la eleccion de la computadora como un nuevo objeto al array creado historialMovimientos.
  historialMovimientosComputadora.push({
    jugador: "Computadora",
    eleccion: eleccionComputadora,
  });

  // Return para que el resultado pueda ser usado fuera del scope del condicional de la eleccionComputadora
  return eleccionComputadora;
}

function jugarJuego(eleccionUsuario) {
  const eleccionComputadora = eligeMovimientoComputadora();

  let resultado = "";
  if (eleccionUsuario === "tijera") {
    if (eleccionComputadora === "piedra") {
      resultado = "PERDISTE";
    } else if (eleccionComputadora === "papel") {
      resultado = "GANASTE";
    } else if (eleccionComputadora === "tijera") {
      resultado = "EMPATE";
    }
  } else if (eleccionUsuario === "papel") {
    if (eleccionComputadora === "piedra") {
      resultado = "GANASTE";
    } else if (eleccionComputadora === "papel") {
      resultado = "EMPATE";
    } else if (eleccionComputadora === "tijera") {
      resultado = "PERDISTE";
    }
  } else if (eleccionUsuario === "piedra") {
    if (eleccionComputadora === "piedra") {
      resultado = "EMPATE";
    } else if (eleccionComputadora === "papel") {
      resultado = "PERDISTE";
    } else if (eleccionComputadora === "tijera") {
      resultado = "GANASTE";
    }
  }

  //Esto es para actualizar el puntaje
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

  //Se muestra el resultado en el parrafo
  document.querySelector(".js-resultado").innerHTML = resultado;

  document.querySelector(".js-movimientos").innerHTML = `Vos
<img src="./img/${eleccionUsuario.toLowerCase()}-emoji.png" class="mov-icon">
<img src="./img/${eleccionComputadora.toLowerCase()}-emoji.png" class="mov-icon">
Computadora`;

  `Elegiste ${eleccionUsuario} - Computadora eligio ${eleccionComputadora}.`;
}

//////////////////

// Aca aplicamos metodo de filtrado sobre arrays con .filter
// Utilizamos .filter para crear un nuevo array que contiene solo los movimientos.
// Luego aplicamos .length para obtener la cantidad de elementos en cada uno de estos nuevos arrays filtrados, lo que representa el número de ganadas, perdidas y empates del usuario en el juego.

const ganadasUsuario = historialMovimientosUsuario.filter(
  (movimiento) => movimiento.resultado === "GANASTE"
).length;

const perdidasUsuario = historialMovimientosUsuario.filter(
  (movimiento) => movimiento.resultado === "PERDISTE"
).length;

const empatesUsuario = historialMovimientosUsuario.filter(
  (movimiento) => movimiento.resultado === "EMPATE"
).length;

function resetear() {
  puntaje.ganadas = 0;
  puntaje.perdidas = 0;
  puntaje.empates = 0;
  actualizaPuntajeElemento();

  // Resetear historial de movimientos
  historialMovimientosUsuario.length = 0;
  historialMovimientosComputadora.length = 0;

  // Mostrar las estadísticas después del reseteo
  mostrarEstadisticas();
}
//event listeners
let piedraBtn = document.querySelector(".js-piedra-btn");
let papelBtn = document.querySelector(".js-papel-btn");
let tijeraBtn = document.querySelector(".js-tijera-btn");
let resetearBtn = document.getElementById("Resetear");

piedraBtn.addEventListener("click", function () {
  jugarJuego("piedra");
});

papelBtn.addEventListener("click", function () {
  jugarJuego("papel");
});

tijeraBtn.addEventListener("click", function () {
  jugarJuego("tijera");
});

resetearBtn.addEventListener("click", resetear);

//////////

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

// Llamada a la función con el historial del usuario
const estadisticasUsuario = calcularEstadisticas(historialMovimientosUsuario);

// Función para mostrar las estadísticas
function mostrarEstadisticas() {
  const estadisticasUsuario = calcularEstadisticas(historialMovimientosUsuario);
  const estadisticasTexto = `
    Total de movimientos: ${estadisticasUsuario.totalMovimientos}
    Ganadas: ${estadisticasUsuario.ganadas}
    Perdidas: ${estadisticasUsuario.perdidas}
    Empates: ${estadisticasUsuario.empates}
    Porcentaje de victorias: ${estadisticasUsuario.porcentajeGanadas.toFixed(
      0
    )}%
    Porcentaje de derrotas: ${estadisticasUsuario.porcentajePerdidas.toFixed(
      0
    )}%
    Porcentaje de empates: ${estadisticasUsuario.porcentajeEmpates.toFixed(0)}%
  `;

  document.querySelector(".js-estadisticas").innerHTML = `${estadisticasTexto}`;
}

// Event listener para el botón de mostrar estadísticas
const mostrarEstadisticasBtn = document.getElementById("MostrarEstadisticas");
mostrarEstadisticasBtn.addEventListener("click", mostrarEstadisticas);
