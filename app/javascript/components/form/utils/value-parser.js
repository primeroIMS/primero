import { NUMERIC_FIELD } from "../constants";

export default (type, value) => {
  switch (type) {
    case NUMERIC_FIELD:
      return parseInt(value, 10);
    default:
      return value;
  }
};
