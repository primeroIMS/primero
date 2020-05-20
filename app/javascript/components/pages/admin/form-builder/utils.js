import range from "lodash/range";

export const convertToFieldsObject = fields =>
  fields
    .map(field => ({ [field.name]: field }))
    .reduce((acc, value) => ({ ...acc, ...value }), {});

export const convertToFieldsArray = fields =>
  Object.keys(fields).map(key => ({ name: key, ...fields[key] }));

export const getOrderDirection = (currentOrder, newOrder) =>
  newOrder - currentOrder;

export const affectedOrderRange = (currentOrder, newOrder) => {
  const orderDirection = getOrderDirection(currentOrder, newOrder);

  if (orderDirection > 0) {
    return range(currentOrder, newOrder + 1);
  }

  if (orderDirection === 0) {
    return [];
  }

  return range(newOrder, currentOrder + 1);
};

export const buildOrderUpdater = (currentOrder, newOrder) => {
  if (getOrderDirection(currentOrder, newOrder) > 0) {
    return field => field.set("order", field.get("order") - 1);
  }

  return field => field.set("order", field.get("order") + 1);
};
