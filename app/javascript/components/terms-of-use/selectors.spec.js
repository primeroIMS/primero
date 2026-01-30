// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { selectUpdatingTermsOfUse } from "./selectors";

describe("TermsOfUse - Selectors", () => {
  describe("selectUpdatingTermsOfUse", () => {
    it("should return updatingTermsOfUse from state", () => {
      const state = fromJS({
        user: {
          updatingTermsOfUse: true
        }
      });

      const result = selectUpdatingTermsOfUse(state);

      expect(result).toEqual(true);
    });

    it("should return null when updatingTermsOfUse is not set", () => {
      const state = fromJS({
        user: {}
      });

      const result = selectUpdatingTermsOfUse(state);

      expect(result).toBeNull();
    });

    it("should handle false value correctly", () => {
      const state = fromJS({
        user: {
          updatingTermsOfUse: false
        }
      });

      const result = selectUpdatingTermsOfUse(state);

      expect(result).toEqual(false);
    });
  });
});
