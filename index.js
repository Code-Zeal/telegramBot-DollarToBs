require("dotenv").config();
const { getDayOfWeek, getHour } = require("./hourAndDate");
const { leerValorDolar, escribirValorDolar } = require("./bd");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { executablePath } = require("puppeteer");
puppeteer.use(StealthPlugin());
const ID_MARCE = process.env.ID_MARCE;
const ID_JAHN = process.env.ID_JAHN;
const ID_DANIRIS = process.env.ID_DANIRIS;
const ID_JHONI = process.env.ID_JHONI;
const ID_GUSTAVO = process.env.ID_GUSTAVO;
const ID_YEINY = process.env.ID_YEINY;
const TELEGRAM_TOKEN_BCV = process.env.TELEGRAM_TOKEN_BCV;
const telegramBot = require("node-telegram-bot-api");
const bot_bcv = new telegramBot(TELEGRAM_TOKEN_BCV, { polling: true });
const port = process.env.PORT || 8080;
const express = require("express");
const app = express();
const apiRouter = require("./api");
app.use("/api", apiRouter);
const sendMessage = async (message) => {
  try {
    const chatIds = [
      ID_MARCE,
      ID_JAHN,
      ID_DANIRIS,
      ID_GUSTAVO,
      ID_JHONI,
      ID_YEINY,
    ];
    chatIds.forEach((chatId) => {
      bot_bcv.sendMessage(chatId, message);
    });
  } catch (error) {
    bot_bcv.sendMessage(ID_MARCE, error);
  }
};
const sendError = async (err) => {
  try {
    bot_bcv.sendMessage(ID_MARCE, err);
  } catch (err) {
    bot_bcv.sendMessage(ID_MARCE, err);
  }
};
const BASE_SELECTOR =
  "#root > div > div.grid.grid-cols-12 > div.lg\\:col-span-8.sm\\:col-span-12.col-span-12.mx-1.overflow-x-auto.px-5 > table > tbody > tr:nth-child";
const TIMEOUT = { waitUntil: "networkidle0", timeout: 90000 };
const URL = process.env.URL;
const main = async () => {
  try {
    const dayOfWeek = getDayOfWeek();
    const hour = getHour();
    console.log(dayOfWeek);
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
      headless: true,
      slowMo: 0,
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
    await page.goto(URL, TIMEOUT);

    const valorActualDolar = await page.evaluate((selectorStr) => {
      const getValue = (index) => {
        return document
          .querySelector(`${selectorStr}(${index}) > td:nth-child(2)`)
          .textContent.trim()
          .slice(0, 5);
      };

      const bcv = parseFloat(getValue(1).replace(",", "."));
      const en_paralelo_vzla3 = parseFloat(getValue(2).replace(",", "."));
      const binance_p2p = parseFloat(getValue(3).replace(",", "."));
      const monitor_dolar_web = parseFloat(getValue(4).replace(",", "."));
      const en_paralelo_vzla_vip = parseFloat(getValue(5).replace(",", "."));

      return {
        bcv,
        en_paralelo_vzla3,
        binance_p2p,
        monitor_dolar_web,
        en_paralelo_vzla_vip,
      };
    }, BASE_SELECTOR);

    await browser.close();

    const calcularCambioPorcentual = (anterior, actual) => {
      if (!Number(anterior)) return 0;
      if (Number(actual) === Number(anterior)) return 0;
      return ((Number(actual) - Number(anterior)) / Number(anterior)) * 100;
    };
    const valorAnteriorDolar = await leerValorDolar();
    const cambioPorcentual = {};
    for (const key in valorActualDolar) {
      const actual = valorActualDolar[key];
      const anterior = parseFloat(valorAnteriorDolar[key]);
      cambioPorcentual[key] = calcularCambioPorcentual(anterior, actual);
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString("es-VE", {
      timeZone: "America/Caracas",
    });
    const mensajesCambio = {};

    for (const key in valorActualDolar) {
      const actual = valorActualDolar[key];
      const anterior = parseFloat(valorAnteriorDolar[key]);
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
    🔵BCV:${valorActualDolar.bcv} ${
      mensajesCambio["bcv"] === undefined ? "" : mensajesCambio["bcv"]
    }\n
    🟡ParaleloVzla3:${valorActualDolar.en_paralelo_vzla3} ${
      mensajesCambio["en_paralelo_vzla3"] === undefined
        ? ""
        : mensajesCambio["en_paralelo_vzla3"]
    }\n
    🔴MonitorDolarWeb:${valorActualDolar.monitor_dolar_web} ${
      mensajesCambio["monitor_dolar_web"] === undefined
        ? ""
        : mensajesCambio["monitor_dolar_web"]
    }\n
      🟡ParaleloVzlaVip:${valorActualDolar.en_paralelo_vzla_vip} ${
      mensajesCambio["en_paralelo_vzla_vip"] === undefined
        ? ""
        : mensajesCambio["en_paralelo_vzla_vip"]
    }\n
    🔶BinanceP2P:${valorActualDolar.binance_p2p} ${
      mensajesCambio["binance_p2p"] === undefined
        ? ""
        : mensajesCambio["binance_p2p"]
    }
     `;
    await escribirValorDolar(valorActualDolar);
    sendMessage(message);
  } catch (error) {
    sendError("error en main()");
    console.error(error);
    main();
  }
};
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
main();

setInterval(main, 3600000);
