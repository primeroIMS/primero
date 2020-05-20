import { fromJS } from "immutable";

import * as utils from "./utils";

describe("<FormBuilder /> - utils", () => {
  describe("convertToFieldsObject", () => {
    it("should return the fields as a single object", () => {
      const fields = [
        { name: "field_1", visible: false },
        { name: "field_2", visible: true }
      ];
      const expected = {
        field_1: { name: "field_1", visible: false },
        field_2: { name: "field_2", visible: true }
      };

      expect(utils.convertToFieldsObject(fields)).to.deep.equal(expected);
    });
  });

  describe("convertToFieldsArray", () => {
    it("should return the fields as an array", () => {
      const fields = {
        field_1: { name: "field_1", visible: false },
        field_2: { name: "field_2", visible: true }
      };

      const expected = [
        { name: "field_1", visible: false },
        { name: "field_2", visible: true }
      ];

      expect(utils.convertToFieldsArray(fields)).to.deep.equal(expected);
    });
  });

  describe("getOrderDirection", () => {
    it("should return the difference of order values", () => {
      expect(utils.getOrderDirection(1, 4)).to.equal(3);
    });
  });

  describe("affectedOrderRange", () => {
    describe("order is greater than current order", () => {
      it("should return the range of orders to be changed", () => {
        expect(utils.affectedOrderRange(1, 4)).to.deep.equal([1, 2, 3, 4]);
      });
    });

    describe("order is less than current order", () => {
      it("should return the range of orders to be changed", () => {
        expect(utils.affectedOrderRange(4, 2)).to.deep.equal([2, 3, 4]);
      });
    });

    describe("order is equal to current order", () => {
      it("should return an empty range of orders to be changed", () => {
        expect(utils.affectedOrderRange(2, 2)).to.deep.equal([]);
      });
    });
  });

  describe("buildOrderUpdater", () => {
    describe("order is greater than current order", () => {
      it("should return a function to decrease the order", () => {
        const orderUpdater = utils.buildOrderUpdater(1, 4);
        const currentOrder = fromJS({ order: 1 });
        const expectedOrder = fromJS({ order: 0 });

        expect(orderUpdater(currentOrder)).to.deep.equal(expectedOrder);
      });
    });

    describe("order is less than current order", () => {
      it("should increase the order", () => {
        const orderUpdater = utils.buildOrderUpdater(4, 1);
        const currentOrder = fromJS({ order: 1 });
        const expectedOrder = fromJS({ order: 2 });

        expect(orderUpdater(currentOrder)).to.deep.equal(expectedOrder);
      });
    });
  });
});
