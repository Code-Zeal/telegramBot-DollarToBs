require("dotenv").config();
const ID_MARCE = process.env.ID_MARCE;
const cron = require("node-cron");
const { getPuppeteerValues } = require("./puppeteerConfig");
const { fileOperations } = require("./fileOperations");
const { hour, dayOfWeek } = require("./hourAndDate");
const { sendMessage } = require("./telegramConfig");

const main = async () => {
  try {
    if (dayOfWeek === 6 || dayOfWeek === 0 || isNaN(dayOfWeek)) {
      console.log("día de la semana de descanso");
      return;
    }
    if (hour > 18 || hour < 7 || isNaN(hour)) {
      console.log("hora de descanso");
      return;
    }
    const valorActualDolar = await getPuppeteerValues();
    const message = fileOperations(valorActualDolar);
    sendMessage(message);
  } catch (error) {
    console.log(error);
  }
};
main().catch((err) => {
  bot_bcv.sendMessage(ID_MARCE, err);
  console.error(err);
  process.exit(1);
});
cron.schedule("*/120 * * * *", () => {
  main();
});
