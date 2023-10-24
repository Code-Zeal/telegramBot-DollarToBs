require("dotenv").config();
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { executablePath } = require("puppeteer");
const { sendError } = require("./telegramConfig");
puppeteer.use(StealthPlugin());
const url = process.env.URL;
const getPuppeteerValues = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      slowMo: 0,
      timeout: 240000,
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
    await page.goto(url, { waitUntil: "networkidle0", setTimeout: 240 });
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
    return {
      BCV,
      EnParaleloVzla3,
      BinanceP2P,
      MonitorDolarWeb,
      EnParaleloVzlaVIP,
    };
  } catch (error) {
    sendError(error);
    console.log(error);
  }
};
module.exports = {
  getPuppeteerValues,
};
