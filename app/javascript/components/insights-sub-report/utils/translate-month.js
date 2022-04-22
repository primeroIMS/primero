export default (key, localizeDate) => {
  const monthNumber = parseInt(key, 10) - 1;
  const dummyDate = new Date(2022, monthNumber, 1, 0, 0, 0);

  return localizeDate(dummyDate, "MMM");
};
