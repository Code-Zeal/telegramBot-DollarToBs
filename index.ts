const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const telegramBot = require("node-telegram-bot-api");
import { Browser } from "puppeteer";
require("dotenv").config();
const TELEGRAM_TOKEN_BCV = process.env.TELEGRAM_TOKEN_BCV;
const ID_MARCE = process.env.ID_MARCE;
const ID_JAHN = process.env.ID_JAHN;
const bot_bcv = new telegramBot(TELEGRAM_TOKEN_BCV, { polling: true });
puppeteer.use(StealthPlugin());

const { executablePath } = require("puppeteer");
const url = "https://monitordolarvenezuela.com";

const main = async () => {
  const browser: Browser = await puppeteer.launch({
    headless: true,
    executablePath: executablePath(),
  });
  const page = await browser.newPage();
  await page.goto(url);
  const bcv = await page.evaluate(() => {
    const dolar = document.querySelector(
      "#promedios > div > div:nth-child(2) > div:nth-child(2) > div > p"
    );
    return dolar.textContent.trim();
  });
  const monitor = await page.evaluate(() => {
    const monitor = document.querySelector(
      "#promedios > div > div:nth-child(2) > div:nth-child(3) > div > p"
    );
    return monitor.textContent.trim();
  });
  const chatIds = [ID_MARCE, ID_JAHN];
  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleString("es-VE", {
    timeZone: "America/Caracas",
  });
  const message = `Fecha: ${formattedDate}\n
  Cambio del dolar a Bs \n
   🔵BCV: Bs = ${bcv} \n
   🟡Monitor: ${monitor}`;

  chatIds.forEach((chatId) => {
    bot_bcv.sendMessage(chatId, message);
  });

  await browser.close();
};
main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// Ejecuta la función main cada dos horas (7200000 milisegundos)
setInterval(main, 7200000);
