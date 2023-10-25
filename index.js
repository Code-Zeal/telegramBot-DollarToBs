const { getPuppeteerValues } = require("./puppeteerConfig");
const { fileOperations } = require("./fileOperations");
const { getDayOfWeek, getHour } = require("./hourAndDate");
const { sendMessage, sendError } = require("./telegramConfig");

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
    const valorActualDolar = await getPuppeteerValues();

    const message = fileOperations(valorActualDolar);
    sendMessage(message);
  } catch (error) {
    sendError("error en main()");
    console.error(error);
    main();
  }
};

main().catch((err) => {
  sendError("error en main()");
  console.error(err);
  main();
});
setInterval(main, 3600000);
