// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (startDate, endDate, localizeDate) => {
  return `${localizeDate(startDate, "yyyy-MMM-dd")} - ${localizeDate(endDate, "yyyy-MMM-dd")}`;
};
