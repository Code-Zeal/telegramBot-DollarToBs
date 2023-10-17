require("dotenv").config();
const ID_MARCE = process.env.ID_MARCE;
const ID_JAHN = process.env.ID_JAHN;
const ID_DANIRIS = process.env.ID_DANIRIS;
const ID_JHONI = process.env.ID_JHONI;
const ID_GUSTAVO = process.env.ID_GUSTAVO;
const ID_YEINY = process.env.ID_YEINY;
const TELEGRAM_TOKEN_BCV = process.env.TELEGRAM_TOKEN_BCV;
const telegramBot = require("node-telegram-bot-api");
const bot_bcv = new telegramBot(TELEGRAM_TOKEN_BCV, { polling: true });
const sendMessage = async (message) => {
  try {
    const chatIds = [
      ID_MARCE,
      ID_JAHN,
      ID_DANIRIS,
      ID_JHONI,
      ID_GUSTAVO,
      ID_YEINY,
    ];
    chatIds.forEach((chatId) => {
      bot_bcv.sendMessage(chatId, message);
    });
  } catch (error) {
    bot_bcv.sendMessage(ID_MARCE, `Error en main: ${error}`);
  }
};
module.exports = {
  sendMessage,
};
