import isNil from "lodash/isNil";

import { DATE_FIELD, NUMERIC_FIELD } from "../constants";

export default (type, value) => {
  switch (type) {
    case NUMERIC_FIELD:
      return value === "" || isNil(value) ? null : parseInt(value, 10);
    case DATE_FIELD:
      return value === "" || isNil(value) ? null : value;
    default:
      return value;
  }
};
