import { SELECT_FIELD } from "../../../form";

import * as utils from "./utils";

describe("<FiltersDialog /> - utils", () => {
  describe("getFilterConstraint", () => {
    it("returns null if no constraint is defined", () => {
      expect(utils.getFilterConstraint(null, SELECT_FIELD)).to.be.null;
    });
  });
});
