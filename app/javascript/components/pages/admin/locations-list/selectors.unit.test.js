import { expect } from "chai";
import { fromJS } from "immutable";

import * as selectors from "./selectors";

describe("pages/admin/locations-list", () => {
  describe("getDisableLocationsLoading", () => {
    it("should return true", () => {
      const state = fromJS({ records: { admin: { locations: { disableLocations: { loading: true } } } } });

      expect(selectors.getDisableLocationsLoading(state)).to.be.true;
    });
  });

  describe("getDisableLocationsErrors", () => {
    it("should return true", () => {
      const state = fromJS({ records: { admin: { locations: { disableLocations: { errors: true } } } } });

      expect(selectors.getDisableLocationsErrors(state)).to.be.true;
    });
  });
});
