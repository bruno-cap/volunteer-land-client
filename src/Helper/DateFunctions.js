export const convertDateLong = (timestamp) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(Date.parse(timestamp));
  const dateOutput =
    months[date.getMonth()] +
    " " +
    date.getDate() +
    ", " +
    date.getFullYear() +
    " at " +
    (date.getHours() > 12 ? date.getHours() - 12 : date.getHours()) +
    ":" +
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    (date.getHours() > 12 ? "pm" : "am");
  return dateOutput;
};

export const convertDateShort = (timestamp) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(Date.parse(timestamp));
  const dateOutput =
    months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
  return dateOutput;
};
