const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const telegramBot = require("node-telegram-bot-api");
require("dotenv").config();
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

const main = async () => {
  console.log("ejecutando main");
  try {
    const event = new Date();

    // Configurar las opciones para toLocaleString
    const options = {
      timeZone: "America/Caracas",
      hour12: false,
    };

    // Convertir la fecha y hora actuales a la zona horaria de Venezuela
    const venezuelaDate = new Date(new Date().toLocaleString("en-US", options));

    // Obtener el día de la semana (0 es Domingo, 1 es Lunes, ..., 6 es Sábado)
    const dayOfWeek = venezuelaDate.getDay();
    console.log(dayOfWeek);

    // Obtener la hora del día (formato de 24 horas)
    const hour = venezuelaDate.getHours();
    console.log(hour);
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      console.log("día de la semana de descanso");
      return;
    }
    if (hour > 18 || hour < 7) {
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
        .textContent.trim();
      const EnParaleloVzla3 = document
        .querySelector(
          "#root > div > div.grid.grid-cols-12 > div.lg\\:col-span-8.sm\\:col-span-12.col-span-12.mx-1.overflow-x-auto.px-5 > table > tbody > tr:nth-child(2) > td:nth-child(2)"
        )
        .textContent.trim();
      const BinanceP2P = document
        .querySelector(
          "#root > div > div.grid.grid-cols-12 > div.lg\\:col-span-8.sm\\:col-span-12.col-span-12.mx-1.overflow-x-auto.px-5 > table > tbody > tr:nth-child(3) > td:nth-child(2)"
        )
        .textContent.trim();
      const MonitorDolarWeb = document
        .querySelector(
          "#root > div > div.grid.grid-cols-12 > div.lg\\:col-span-8.sm\\:col-span-12.col-span-12.mx-1.overflow-x-auto.px-5 > table > tbody > tr:nth-child(4) > td:nth-child(2)"
        )
        .textContent.trim();
      const EnParaleloVzlaVIP = document
        .querySelector(
          "#root > div > div.grid.grid-cols-12 > div.lg\\:col-span-8.sm\\:col-span-12.col-span-12.mx-1.overflow-x-auto.px-5 > table > tbody > tr:nth-child(5) > td:nth-child(2)"
        )
        .textContent.trim();
      return {
        BCV,
        EnParaleloVzla3,
        BinanceP2P,
        MonitorDolarWeb,
        EnParaleloVzlaVIP,
      };
    });
    await browser.close();
    const chatIds = [ID_MARCE];
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleString("es-VE", {
      timeZone: "America/Caracas",
    });
    const message = ` ${
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
   🔵BCV:${BCV}\n
   🟡ParaleloVzla3:${EnParaleloVzla3}\n
   🔴MonitorDolarWeb:${MonitorDolarWeb}\n
   🟡ParaleloVzlaVip:${EnParaleloVzlaVIP}\n
   🔶BinanceP2P:${BinanceP2P}
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

setInterval(main, 7200000);
