// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import * as selectors from "./selectors";

describe("pages/admin/locations-list", () => {
  describe("getDisableLocationsLoading", () => {
    it("should return true", () => {
      const state = fromJS({ records: { admin: { locations: { disableLocations: { loading: true } } } } });

      expect(selectors.getDisableLocationsLoading(state)).toBe(true);
    });
  });

  describe("getDisableLocationsErrors", () => {
    it("should return true", () => {
      const state = fromJS({ records: { admin: { locations: { disableLocations: { errors: true } } } } });

      expect(selectors.getDisableLocationsErrors(state)).toBe(true);
    });
  });
});
