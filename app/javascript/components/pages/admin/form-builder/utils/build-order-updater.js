// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getOrderDirection from "./get-order-direction";

export default (currentOrder, newOrder) => {
  if (getOrderDirection(currentOrder, newOrder) > 0) {
    return field => field.set("order", field.get("order") - 1);
  }

  return field => field.set("order", field.get("order") + 1);
};
