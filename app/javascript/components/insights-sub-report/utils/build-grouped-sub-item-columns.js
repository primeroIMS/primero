import isEmpty from "lodash/isEmpty";

export default columns => {
  if (isEmpty(columns)) return {};

  return columns.reduce((acc, column) => {
    if (!column.subItems) {
      return acc;
    }
    const items = column.items || [column.label];
    const itemSubItems = items.reduce(
      (accum, item) => ({ ...accum, [`${column.label}-${item}`]: column.subItems }),
      {}
    );

    return { ...acc, ...itemSubItems };
  }, {});
};
