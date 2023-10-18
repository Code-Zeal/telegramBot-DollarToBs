const fs = require("fs");
const { hour, dayOfWeek } = require("./hourAndDate");
const fileOperations = (valorActualDolar) => {
  try {
    const leerArchivo = (ruta) => {
      try {
        const jsonString = fs.readFileSync(ruta);
        return JSON.parse(jsonString);
      } catch (error) {
        console.log("Error al leer el archivo:", error);
        return {};
      }
    };

    const escribirArchivo = (ruta, contenido) => {
      try {
        fs.writeFileSync(ruta, JSON.stringify(contenido));
      } catch (error) {
        console.log("Error al escribir en el archivo:", error);
      }
    };
    const rutaArchivo = "./dollar.json";
    const dataAnterior = leerArchivo(rutaArchivo);
    const calcularCambioPorcentual = (anterior, actual) => {
      if (!Number(anterior)) return 0;
      if (Number(actual) === Number(anterior)) return 0;
      return ((Number(actual) - Number(anterior)) / Number(anterior)) * 100;
    };
    const valorAnteriorDolar = dataAnterior.valorDolar || {};

    const cambioPorcentual = {};
    for (const key in valorActualDolar) {
      const actual = parseFloat(valorActualDolar[key].replace(",", "."));
      const anterior = parseFloat(valorAnteriorDolar[key].replace(",", "."));
      cambioPorcentual[key] = calcularCambioPorcentual(anterior, actual);
    }
    const newData = {
      valorDolar: valorActualDolar,
    };
    escribirArchivo(rutaArchivo, newData);

    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleString("es-VE", {
      timeZone: "America/Caracas",
    });
    const mensajesCambio = {};
    for (const key in valorActualDolar) {
      const actual = parseFloat(valorActualDolar[key].replace(",", "."));
      const anterior = parseFloat(valorAnteriorDolar[key].replace(",", "."));
      cambioPorcentual[key] = calcularCambioPorcentual(anterior, actual);
      if (cambioPorcentual[key] > 0) {
        mensajesCambio[key] = `📈 ${cambioPorcentual[key].toFixed(2)}%`;
      } else if (cambioPorcentual[key] < 0) {
        mensajesCambio[key] = `📉 ${Math.abs(cambioPorcentual[key]).toFixed(
          2
        )}%`;
      } else {
        mensajesCambio[key] = "";
      }
    }
    const status =
      hour + 1 > 18 && dayOfWeek + 1 !== 6
        ? "🔴🔴🔴CIERRE DEL DÍA🔴🔴🔴"
        : hour + 1 > 18 && dayOfWeek + 1 === 6
        ? "🔴🔴CIERRE DE LA SEMANA🔴🔴"
        : hour - 1 < 7 && dayOfWeek - 1 !== 0
        ? "🟢🟢🟢INICIO DEL DÍA🟢🟢🟢"
        : hour - 1 < 7 && dayOfWeek - 1 === 0
        ? "🟢🟢🟢INICIO DE LA SEMANA🟢🟢🟢"
        : "";
    const message = `
  ${status}
  Fecha: ${formattedDate}\n
  Cambios del dolar a Bs\n
   🔵BCV:${BCV} ${
      mensajesCambio["BCV"] === undefined ? "" : mensajesCambio["BCV"]
    }\n
   🟡ParaleloVzla3:${EnParaleloVzla3} ${
      mensajesCambio["EnParaleloVzla3"] === undefined
        ? ""
        : mensajesCambio["EnParaleloVzla3"]
    }\n
   🔴MonitorDolarWeb:${MonitorDolarWeb} ${
      mensajesCambio["MonitorDolarWeb"] === undefined
        ? ""
        : mensajesCambio["MonitorDolarWeb"]
    }\n
   🟡ParaleloVzlaVip:${EnParaleloVzlaVIP} ${
      mensajesCambio["EnParaleloVzlaVIP"] === undefined
        ? ""
        : mensajesCambio["EnParaleloVzlaVIP"]
    }\n
   🔶BinanceP2P:${BinanceP2P} ${
      mensajesCambio["BinanceP2P"] === undefined
        ? ""
        : mensajesCambio["BinanceP2P"]
    }
   `;
    return message;
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  fileOperations,
};
