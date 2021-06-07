import { format } from "date-fns";

import { DATE_FORMAT } from "../../../config";

export default filter => {
  const { value } = filter;

  if (value instanceof Date) {
    return format(value, DATE_FORMAT);
  }

  return value;
};
