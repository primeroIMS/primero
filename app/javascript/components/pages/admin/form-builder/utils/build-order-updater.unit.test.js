// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import buildOrderUpdater from "./build-order-updater";

describe("buildOrderUpdater", () => {
  describe("order is greater than current order", () => {
    it("should return a function to decrease the order", () => {
      const orderUpdater = buildOrderUpdater(1, 4);
      const currentOrder = fromJS({ order: 1 });
      const expectedOrder = fromJS({ order: 0 });

      expect(orderUpdater(currentOrder)).toEqual(expectedOrder);
    });
  });

  describe("order is less than current order", () => {
    it("should increase the order", () => {
      const orderUpdater = buildOrderUpdater(4, 1);
      const currentOrder = fromJS({ order: 1 });
      const expectedOrder = fromJS({ order: 2 });

      expect(orderUpdater(currentOrder)).toEqual(expectedOrder);
    });
  });
});
