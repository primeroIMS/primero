import { expect } from "chai";
import { Map, List } from "immutable";

import {
  selectModules,
  selectAgency,
  selectAuthErrors,
  selectAuthenticated
} from "./selectors";

const stateWithNoRecords = Map({});
const stateWithRecords = Map({
  user: Map({
    modules: List(["primeromodule-cp", "primeromodule-gbv"]),
    agency: "unicef",
    isAuthenticated: true,
    messages: null
  })
});

describe("<Login /> - Selectors", () => {
  describe("selectModules", () => {
    it("should return records", () => {
      const records = selectModules(stateWithRecords);

      expect(records).to.deep.equal(
        List(["primeromodule-cp", "primeromodule-gbv"])
      );
    });

    it("should return empty object when records empty", () => {
      const records = selectModules(stateWithNoRecords);

      expect(records).to.be.undefined;
    });
  });

  describe("selectAgency", () => {
    it("should return records", () => {
      const records = selectAgency(stateWithRecords);

      expect(records).to.deep.equal("unicef");
    });

    it("should return empty object when records empty", () => {
      const records = selectAgency(stateWithNoRecords);

      expect(records).to.be.undefined;
    });
  });

  describe("selectAuthErrors", () => {
    it("should return records meta", () => {
      const meta = selectAuthErrors(stateWithRecords);

      expect(meta).to.deep.equal("");
    });

    it("should return empty object when records empty", () => {
      const meta = selectAuthErrors(stateWithNoRecords);

      expect(meta).to.deep.equal("");
    });
  });

  describe("selectAuthenticated", () => {
    it("should return records meta", () => {
      const meta = selectAuthenticated(stateWithRecords);

      expect(meta).to.deep.equal(true);
    });

    it("should return empty object when records empty", () => {
      const meta = selectAuthenticated(stateWithNoRecords);

      expect(meta).to.deep.equal(false);
    });
  });
});
