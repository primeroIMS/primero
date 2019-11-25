import { Map } from "immutable";

import { expect } from "../../test";

import { FORM_MODE_NEW } from "./constants";
import { buildFormModeObject } from "./helpers";

describe("<Form /> - Helpers", () => {
  describe("buildFormModeObject()", () => {
    it("should build form state object", () => {
      const formMode = buildFormModeObject(FORM_MODE_NEW);

      const expected = Map({
        isShow: false,
        isNew: true,
        isEdit: false,
        isDialog: false
      });

      expect(formMode).to.deep.equal(expected);
    });
  });
});
