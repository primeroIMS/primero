import range from "lodash/range";

import getOrderDirection from "./get-order-direction";

export default (currentOrder, newOrder, step = 1) => {
  const orderDirection = getOrderDirection(currentOrder, newOrder);

  if (orderDirection > 0) {
    return range(currentOrder, newOrder + step, step);
  }

  if (orderDirection === 0) {
    return [];
  }

  return range(newOrder, currentOrder + step, step);
};
