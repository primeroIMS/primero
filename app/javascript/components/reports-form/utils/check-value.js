import { format } from "date-fns";

import { selectedDateFormat } from "../../../libs/date-picker-localization";

export default (filter, i18n) => {
  const { value } = filter;

  if (value instanceof Date) {
    return format(value, selectedDateFormat(false, i18n.locale));
  }

  return value;
};
