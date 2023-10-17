const options = {
  timeZone: "America/Caracas",
  hour12: false,
};
const venezuelaDate = new Date(new Date().toLocaleString("en-US", options));

const dayOfWeek = venezuelaDate.getDay();
const hour = venezuelaDate.getHours();
module.exports = {
  dayOfWeek,
  hour,
};
