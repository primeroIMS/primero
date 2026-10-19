import { AND_FILTER_NAME } from "../constants";

export default (filter, params) => {
  const andParam = params[AND_FILTER_NAME];

  if (andParam) {
    return Array.isArray(andParam) && andParam.some(param => param[filter.field_name]);
  }

  return false;
};
