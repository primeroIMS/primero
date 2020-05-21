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
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  describe("getLookup", () => {
    it("should return selected role", () => {
      const expected = state.getIn([
        "records",
        "admin",
        "lookups",
        "selectedLookup"
      ]);

      const role = selectors.getLookup(state);

      expect(role).to.deep.equal(expected);
    });

    it("should return empty object when selected role empty", () => {
      const role = selectors.getLookup(stateWithoutRecords);

      expect(role).to.be.empty;
    });
  });

  describe("getSavingLookup", () => {
    it("should return saving", () => {
      const expected = state.getIn(["records", "admin", "lookups", SAVING]);

      const saving = selectors.getSavingLookup(state);

      expect(saving).to.deep.equal(expected);
    });
  });
});
