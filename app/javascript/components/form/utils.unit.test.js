import { Map } from "immutable";

import { expect } from "../../test";

import { compactData, whichFormMode } from "./utils";
import { FORM_MODE_NEW } from "./constants";

describe("<Form /> - Utils", () => {
  describe("buildFormModeObject()", () => {
    it("should build form state object", () => {
      const formMode = whichFormMode(FORM_MODE_NEW);

      const expected = Map({
        isShow: false,
        isNew: true,
        isEdit: false,
        isDialog: false
      });

      expect(formMode).to.deep.equal(expected);
    });
  });

  describe("compactData()", () => {
    it("returns compacted object", () => {
      const expected = {
        prop2: true,
        prop4: ["open"],
        prop6: { option1: "option1" }
      };

      const values = {
        prop1: false,
        prop2: true,
        prop3: [],
        prop4: ["open"],
        prop5: {},
        prop6: { option1: "option1" }
      };

      expect(compactData(values)).to.deep.equal(expected);
    });
  });
});
