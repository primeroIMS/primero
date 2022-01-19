import orderBy from "lodash/orderBy";

export default (data, multiple = false) => {
  return orderBy(
    data,
    curr => {
      return new Date(multiple ? curr[0] : curr);
    },
    ["asc"]
  );
};
