// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getDateFormat from "./get-date-format";
import localizeReportsDates from "./localize-reports-dates";

export default (key, i18n) => {
  const dateFormat = getDateFormat(key);

  return dateFormat ? localizeReportsDates(key, i18n, dateFormat).toString() : key;
};
