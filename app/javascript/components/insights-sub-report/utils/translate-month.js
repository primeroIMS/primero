export default (groupKey, localizeDate) => {
  const monthNumber = parseInt(groupKey, 10) - 1;
  const dummyDate = new Date(2022, monthNumber, 1, 0, 0, 0);

  return localizeDate(dummyDate, "MMM");
};
