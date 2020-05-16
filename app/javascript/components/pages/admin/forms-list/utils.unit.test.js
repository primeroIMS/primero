import { fromJS } from "immutable";

import { DRAGGING_IDLE_COLOR, DRAGGING_COLOR } from "./constants";
import * as utils from "./utils";

describe("<FormsList /> - Utils", () => {
  describe("getItemStyle", () => {
    it("should return the correct object", () => {
      const expected = {
        userSelect: "none",
        background: DRAGGING_COLOR
      };

      expect(utils.getItemStyle(true, {})).to.deep.equal(expected);
    });
  });

  describe("getListStyle", () => {
    it("should return the correct object", () => {
      const expected = { background: DRAGGING_COLOR };

      expect(utils.getListStyle(true)).to.deep.equal(expected);
    });
  });

  describe("buildOrderUpdater", () => {
    it("should return a function that updates the order of a element", () => {
      const expected = fromJS({ order_form_group: 0 });
      const current = 0;
      const newOrder = 20;

      const updater = utils.buildOrderUpdater(current, newOrder);

      expect(updater(fromJS({ order_form_group: 10 }))).to.deep.equal(expected);
    });
  });

  describe("reorderElems", () => {
    it("should return the correct object", () => {
      const formSections = fromJS([
        { unique_id: "form_1", order: 0, id: 1 },
        { unique_id: "form_2", order: 10, id: 2 }
      ]);

      const reorderedForms = utils.reorderElems({
        fieldsMeta: {
          idField: "unique_id",
          keyField: "id",
          orderField: "order"
        },
        orderMeta: {
          step: 10,
          target: 10
        },
        elemId: "form_1",
        elems: formSections
      });

      const expected = fromJS({
        "1": { unique_id: "form_1", order: 10, id: 1 },
        "2": { unique_id: "form_2", order: 0, id: 2 }
      });

      expect(reorderedForms).to.deep.equal(expected);
    });
  });
});
