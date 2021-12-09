import isObject from "lodash/isObject";

export default errors => {
  if (isObject(errors)) {
    return Object.values(errors);
  }

  return errors;
};
