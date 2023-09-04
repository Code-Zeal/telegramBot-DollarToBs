const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const telegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const TELEGRAM_TOKEN_BCV = process.env.TELEGRAM_TOKEN_BCV;
const ID_MARCE = process.env.ID_MARCE;
const ID_JAHN = process.env.ID_JAHN;
const ID_DANIRIS = process.env.ID_DANIRIS;
const ID_JHONI = process.env.ID_JHONI;

const bot_bcv = new telegramBot(TELEGRAM_TOKEN_BCV, { polling: true });
const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("Servidor de bot con puppeteer está funcionando correctamente");
});
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

puppeteer.use(StealthPlugin());

const { executablePath } = require("puppeteer");
const url = "https://monitordolarvenezuela.com";

const main = async () => {
  try {
    const newCurrentDate = new Date();
    const newFormattedDate = newCurrentDate.toLocaleString("es-VE", {
      timeZone: "America/Caracas",
    });
    const dayOfWeek = newFormattedDate.getDay();
    const hour = newFormattedDate.getHours();
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      return;
    }
    if (hour >= 19 || hour < 6) {
      return;
    }
    const browser = await puppeteer.launch({
      headless: true,
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
    await page.goto(url);

    const {
      bcv,
      MonitorDolarWeb,
      paralelovzla3,
      monitor,
      EnParaleloVzlaVip,
      BinanceP2P,
    } = await page.evaluate(() => {
      const bcv = document
        .querySelector(
          "#promedios > div:nth-child(2) > div:nth-child(2) > div > p"
        )
        .textContent.trim()
        .slice(-6);
      const paralelovzla3 = document
        .querySelector(
          "#promedios > div:nth-child(2) > div:nth-child(3) > div > p"
        )
        .textContent.trim()
        .slice(-6);
      const MonitorDolarWeb = document
        .querySelector(
          "#promedios > div:nth-child(2) > div:nth-child(5) > div > p"
        )
        .textContent.trim()
        .slice(-6);
      const EnParaleloVzlaVip = document
        .querySelector(
          "#promedios > div:nth-child(4) > div:nth-child(2) > div > p"
        )
        .textContent.trim()
        .slice(-6);
      const BinanceP2P = document
        .querySelector(
          "#promedios > div:nth-child(2) > div:nth-child(4) > div > p"
        )
        .textContent.trim();
      return {
        bcv,
        MonitorDolarWeb,
        paralelovzla3,
        monitor,
        EnParaleloVzlaVip,
        BinanceP2P,
      };
    });

    const chatIds = [ID_MARCE, ID_JAHN, ID_DANIRIS, ID_JHONI];
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleString("es-VE", {
      timeZone: "America/Caracas",
    });
    const message = `Fecha: ${formattedDate}\n
  Cambios del dolar a Bs\n
   🔵BCV:${bcv}Bs\n
   🟡ParaleloVzla3:${paralelovzla3}Bs\n
   🔴MonitorDolarWeb:${MonitorDolarWeb}Bs\n
   🟡ParaleloVzlaVip:${EnParaleloVzlaVip}Bs\n
   🔶BinanceP2P:${BinanceP2P}Bs
   `;

    chatIds.forEach((chatId) => {
      bot_bcv.sendMessage(chatId, message);
    });

    await browser.close();
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
