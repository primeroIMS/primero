// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import * as selectors from "./selectors";

describe("components/drawer/selectors.js", () => {
  describe("getDrawers", () => {
    it("should return the current drawers", () => {
      const drawers = fromJS({ formDrawer: true });
      const state = fromJS({ ui: { drawers } });

      expect(selectors.getDrawers(state)).toEqual(drawers);
    });
  });
});
