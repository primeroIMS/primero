// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { getImportErrors } from "./selectors";

const state = fromJS({
  records: {
    admin: {
      locations: {
        import: {
          errors: [{ message: "Test error" }]
        }
      }
    }
  }
});

const stateWithoutHeaders = fromJS({});

describe("<ImportDialog /> - selectors", () => {
  describe("getErrors", () => {
    it("should return errors", () => {
      const expected = state.getIn(["records", "admin", "locations", "import", "errors"]);

      const errors = getImportErrors(state);

      expect(errors).toEqual(expected);
    });

    it("should return false when errors empty", () => {
      const errors = getImportErrors(stateWithoutHeaders);

      expect(errors.size).toBe(0);
    });
  });
});
