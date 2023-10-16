const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const telegramBot = require("node-telegram-bot-api");
const cron = require("node-cron");
require("dotenv").config();
const fs = require("fs");

const TELEGRAM_TOKEN_BCV = process.env.TELEGRAM_TOKEN_BCV;
const ID_MARCE = process.env.ID_MARCE;
const ID_JAHN = process.env.ID_JAHN;
const ID_DANIRIS = process.env.ID_DANIRIS;
const ID_JHONI = process.env.ID_JHONI;
const ID_GUSTAVO = process.env.ID_GUSTAVO;
const bot_bcv = new telegramBot(TELEGRAM_TOKEN_BCV, { polling: true });
const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("Servidor de bot con puppeteer está funcionando correctamente");
});
const port = process.env.PORT || 4230;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

puppeteer.use(StealthPlugin());

const { executablePath } = require("puppeteer");
const url = "https://monitordolarvenezuela.com/monitor-dolar-hoy";
const leerArchivo = (ruta) => {
  try {
    const jsonString = fs.readFileSync(ruta);
    return JSON.parse(jsonString);
  } catch (error) {
    console.log("Error al leer el archivo:", error);
    return {};
  }
};

// Función para escribir en el archivo JSON
const escribirArchivo = (ruta, contenido) => {
  try {
    fs.writeFileSync(ruta, JSON.stringify(contenido));
  } catch (error) {
    console.log("Error al escribir en el archivo:", error);
  }
};
const main = async () => {
  console.log("ejecutando main");

  try {
    const options = {
      timeZone: "America/Caracas",
      hour12: false,
    };
    const venezuelaDate = new Date(new Date().toLocaleString("en-US", options));

    const dayOfWeek = venezuelaDate.getDay();
    console.log(dayOfWeek);
    const hour = venezuelaDate.getHours();
    console.log(hour);
    if (dayOfWeek === 6 || dayOfWeek === 0 || isNaN(dayOfWeek)) {
      console.log("día de la semana de descanso");
      return;
    }
    if (hour > 18 || hour < 7 || isNaN(hour)) {
      console.log("hora de descanso");
      return;
    }
    const browser = await puppeteer.launch({
      headless: "new",
      slowMo: 0,
      timeout: 120000,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--single-process",
        "--no-zygote",
      ],

      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : executablePath(),
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", setTimeout: 120 });
    const {
      BCV,
      EnParaleloVzla3,
      BinanceP2P,
      MonitorDolarWeb,
      EnParaleloVzlaVIP,
    } = await page.evaluate(() => {
      const BCV = document
        .querySelector(
          "#root > div > div.grid.grid-cols-12 > div.lg\\:col-span-8.sm\\:col-span-12.col-span-12.mx-1.overflow-x-auto.px-5 > table > tbody > tr:nth-child(1) > td:nth-child(2)"
        )
        .textContent.trim()
        .slice(0, 5);
      const EnParaleloVzla3 = document
        .querySelector(
          "#root > div > div.grid.grid-cols-12 > div.lg\\:col-span-8.sm\\:col-span-12.col-span-12.mx-1.overflow-x-auto.px-5 > table > tbody > tr:nth-child(2) > td:nth-child(2)"
        )
        .textContent.trim()
        .slice(0, 5);
      const BinanceP2P = document
        .querySelector(
          "#root > div > div.grid.grid-cols-12 > div.lg\\:col-span-8.sm\\:col-span-12.col-span-12.mx-1.overflow-x-auto.px-5 > table > tbody > tr:nth-child(3) > td:nth-child(2)"
        )
        .textContent.trim()
        .slice(0, 5);
      const MonitorDolarWeb = document
        .querySelector(
          "#root > div > div.grid.grid-cols-12 > div.lg\\:col-span-8.sm\\:col-span-12.col-span-12.mx-1.overflow-x-auto.px-5 > table > tbody > tr:nth-child(4) > td:nth-child(2)"
        )
        .textContent.trim()
        .slice(0, 5);
      const EnParaleloVzlaVIP = document
        .querySelector(
          "#root > div > div.grid.grid-cols-12 > div.lg\\:col-span-8.sm\\:col-span-12.col-span-12.mx-1.overflow-x-auto.px-5 > table > tbody > tr:nth-child(5) > td:nth-child(2)"
        )
        .textContent.trim()
        .slice(0, 5);
      return {
        BCV,
        EnParaleloVzla3,
        BinanceP2P,
        MonitorDolarWeb,
        EnParaleloVzlaVIP,
      };
    });

    await browser.close();
    const valorActualDolar = {
      BCV,
      EnParaleloVzla3,
      BinanceP2P,
      MonitorDolarWeb,
      EnParaleloVzlaVIP,
    };
    const rutaArchivo = "./dollar.json"; // Reemplaza con tu ruta de archivo específica
    const dataAnterior = leerArchivo(rutaArchivo);
    const calcularCambioPorcentual = (anterior, actual) => {
      console.log(anterior, actual);
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
    const chatIds = [ID_MARCE, ID_JAHN, ID_DANIRIS, ID_JHONI, ID_GUSTAVO];
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

    const message = `
    ${
      hour + 2 > 22 && dayOfWeek + 1 !== 6
        ? "🔴🔴🔴CIERRE DEL DÍA🔴🔴🔴 \n"
        : ""
    }
    ${
      hour + 2 > 18 && dayOfWeek + 1 === 6
        ? "🔴🔴CIERRE DE LA SEMANA🔴🔴 \n"
        : ""
    }
     ${
       hour - 2 < 7 && dayOfWeek - 1 !== 0
         ? "🟢🟢🟢INICIO DEL DÍA🟢🟢🟢 \n"
         : ""
     }
     ${
       hour - 2 < 7 && dayOfWeek - 1 === 0
         ? "🟢🟢🟢INICIO DE LA SEMANA🟢🟢🟢 \n"
         : ""
     }Fecha: ${formattedDate}\n
  Cambios del dolar a Bs\n
   🔵BCV:${BCV} ${mensajesCambio["BCV"]}\n
   🟡ParaleloVzla3:${EnParaleloVzla3} ${mensajesCambio["EnParaleloVzla3"]}\n
   🔴MonitorDolarWeb:${MonitorDolarWeb} ${mensajesCambio["MonitorDolarWeb"]}\n
   🟡ParaleloVzlaVip:${EnParaleloVzlaVIP} ${
      mensajesCambio["EnParaleloVzlaVIP"]
    }\n
   🔶BinanceP2P:${BinanceP2P} ${mensajesCambio["BinanceP2P"]}
   `;

    chatIds.forEach((chatId) => {
      bot_bcv.sendMessage(chatId, message);
    });
  } catch (error) {
    bot_bcv.sendMessage(ID_MARCE, `Error en main: ${error}`);
  }
};
main().catch((err) => {
  bot_bcv.sendMessage(ID_MARCE, `Error en el primer mensaje en main: ${err}`);
  console.error(err);
  process.exit(1);
});
cron.schedule("*/120 * * * *", () => {
  main();
});
