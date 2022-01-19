import { parse } from "date-fns";

import isDateRange from "./is-date-range";

export default (value, i18n, dateFormat) => {
  if (isDateRange(value)) {
    const splittedDateRange = value.split(" - ");
    const dateFrom = parse(splittedDateRange[0], dateFormat, new Date());
    const dateTo = parse(splittedDateRange[1], dateFormat, new Date());

    const dateFromLocalized = dateFrom ? i18n.localizeDate(dateFrom, dateFormat) : i18n.l(value);
    const dateToLocalized = dateTo ? i18n.localizeDate(dateTo, dateFormat) : i18n.l(value);

    return `${dateFromLocalized} - ${dateToLocalized}`;
  }
  const date = parse(value, dateFormat, new Date());

  return date ? i18n.localizeDate(date, dateFormat) : i18n.l(value);
};
