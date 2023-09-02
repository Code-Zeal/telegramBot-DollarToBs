const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const telegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const TELEGRAM_TOKEN_BCV = process.env.TELEGRAM_TOKEN_BCV;
const ID_MARCE = process.env.ID_MARCE;
const ID_JAHN = process.env.ID_JAHN;
const ID_DANIRIS = process.env.ID_DANIRIS;
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
  const browser = await puppeteer.launch({
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
  const bcv = await page.evaluate(() => {
    const dolar = document.querySelector(
      "#promedios > div:nth-child(2) > div:nth-child(2) > div > p"
    );
    return dolar.textContent.trim();
  });
  const paralelovzla3 = await page.evaluate(() => {
    const monitor = document.querySelector(
      "#promedios > div:nth-child(2) > div:nth-child(3) > div > p"
    );
    return monitor.textContent.trim();
  });
  const MonitorDolarWeb = await page.evaluate(() => {
    const monitor = document.querySelector(
      "#promedios > div:nth-child(2) > div:nth-child(5) > div > p"
    );
    return monitor.textContent.trim();
  });
  const EnParaleloVzlaVip = await page.evaluate(() => {
    const monitor = document.querySelector(
      "#promedios > div:nth-child(4) > div:nth-child(2) > div > p"
    );
    return monitor.textContent.trim();
  });
  const BinanceP2P = await page.evaluate(() => {
    const monitor = document.querySelector(
      "#promedios > div:nth-child(2) > div:nth-child(4) > div > p"
    );
    return monitor.textContent.trim();
  });
  const chatIds = [ID_MARCE, ID_JAHN, ID_DANIRIS];
  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleString("es-VE", {
    timeZone: "America/Caracas",
  });
  const message = `Fecha: ${formattedDate}\n
  Cambios del dolar a Bs \n
   🔵BCV: ${bcv.slice(-6)} \n
   🟡EnParaleloVzla3:${paralelovzla3.slice(-6)} \n
   🔴MonitorDolarWeb:${MonitorDolarWeb.slice(-6)} \n
   🟡EnParaleloVzlaVip:${EnParaleloVzlaVip.slice(-6)} \n
   🔶Binance P2P:${BinanceP2P.slice(-6)}
   `;

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
