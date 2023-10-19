const getDayOfWeek = () => {
  const options = {
    timeZone: "America/Caracas",
    hour12: false,
  };
  const venezuelaDate = new Date(new Date().toLocaleString("en-US", options));

  const dayOfWeek = venezuelaDate.getDay();
  return dayOfWeek;
};
const getHour = () => {
  const options = {
    timeZone: "America/Caracas",
    hour12: false,
  };
  const venezuelaDate = new Date(new Date().toLocaleString("en-US", options));

  const hour = venezuelaDate.getHours();
  return hour;
};
module.exports = {
  getDayOfWeek,
  getHour,
};
