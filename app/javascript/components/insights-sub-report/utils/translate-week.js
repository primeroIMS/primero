export default (startDate, endDate, localizeDate) => {
  return `${localizeDate(startDate, "yyyy-MMM-dd")} - ${localizeDate(endDate, "yyyy-MMM-dd")}`;
};
