require("dotenv").config();
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { executablePath } = require("puppeteer");
const { sendError } = require("./telegramConfig");

puppeteer.use(StealthPlugin());

const BASE_SELECTOR =
  "#root > div > div.grid.grid-cols-12 > div.lg\\:col-span-8.sm\\:col-span-12.col-span-12.mx-1.overflow-x-auto.px-5 > table > tbody > tr:nth-child";
const TIMEOUT = { waitUntil: "networkidle0", timeout: 90000 };
const URL = process.env.URL;

const getPuppeteerValues = async () => {
  try {
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

    const result = await page.evaluate((selectorStr) => {
      const getValue = (index) => {
        return document
          .querySelector(`${selectorStr}(${index}) > td:nth-child(2)`)
          .textContent.trim()
          .slice(0, 5);
      };

      const BCV = getValue(1);
      const EnParaleloVzla3 = getValue(2);
      const BinanceP2P = getValue(3);
      const MonitorDolarWeb = getValue(4);
      const EnParaleloVzlaVIP = getValue(5);

      return {
        BCV,
        EnParaleloVzla3,
        BinanceP2P,
        MonitorDolarWeb,
        EnParaleloVzlaVIP,
      };
    }, BASE_SELECTOR);

    await browser.close();
    return result;
  } catch (error) {
    sendError("Error en getPuppeteerValues()");
    console.error(error);
    getPuppeteerValues();
  }
};

module.exports = {
  getPuppeteerValues,
};
