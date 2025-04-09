// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { SAVING } from "../../../../config";

import * as selectors from "./selectors";

const state = fromJS({
  records: {
    admin: {
      lookups: {
        selectedLookup: { id: 1 },
        errors: true,
        saving: false
      }
    }
  }
});

const stateWithoutRecords = fromJS({});

describe("<LookupsForm /> - selectors", () => {
  it("should have known the selectors", () => {
    const creators = { ...selectors };

    ["getLookup", "getSavingLookup"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  describe("getLookup", () => {
    it("should return selected role", () => {
      const expected = state.getIn(["records", "admin", "lookups", "selectedLookup"]);

      const role = selectors.getLookup(state);

      expect(role).toEqual(expected);
    });

    it("should return empty object when selected role empty", () => {
      const role = selectors.getLookup(stateWithoutRecords);

      expect(role.size).toBe(0);
    });
  });

  describe("getSavingLookup", () => {
    it("should return saving", () => {
      const expected = state.getIn(["records", "admin", "lookups", SAVING]);

      const saving = selectors.getSavingLookup(state);

      expect(saving).toEqual(expected);
    });
  });
});
