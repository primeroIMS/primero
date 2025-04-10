// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import * as selectors from "./selectors";

describe("components/form-filters/selectors.js", () => {
  describe("getFormFilters", () => {
    it("should return the current filters", () => {
      const formFilters = fromJS({ form_1: { filter_1: ["value_1", "value2"] } });
      const state = fromJS({ ui: { formFilters } });

      expect(selectors.getFormFilters(state)).toEqual(formFilters);
    });
  });
});
