export default (startDate, endDate, localizeDate) => {
  return `${localizeDate(startDate, "dd-MMM-yyyy")} - ${localizeDate(endDate, "dd-MMM-yyyy")}`;
};
