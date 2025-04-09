// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { SELECT_FIELD } from "../../../form";

import * as utils from "./utils";

describe("<FiltersDialog /> - utils", () => {
  describe("getFilterConstraint", () => {
    it("returns null if no constraint is defined", () => {
      expect(utils.getFilterConstraint(null, SELECT_FIELD)).toBeNull();
    });
  });
});
