import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";

import * as selectors from "./selectors";

chai.use(chaiImmutable);

const stateWithNoRecords = Map({});
const stateWithRecords = Map({
  user: Map({
    module: "gbv",
    agency: "unicef",
    isAuthenticated: true,
    messages: null
  })
});

describe("<Login /> - Selectors", () => {

  describe("selectModule", () => {
    it("should return records", () => {
      const records = selectors.selectModule(stateWithRecords);
      expect(records).to.deep.equal("gbv");
    });

    it("should return empty object when records empty", () => {
      const records = selectors.selectModule(stateWithNoRecords);
      expect(records).to.be.undefined;
    });
  });

  describe("selectAgency", () => {
    it("should return records", () => {
      const records = selectors.selectAgency(stateWithRecords);
      expect(records).to.deep.equal("unicef");
    });

    it("should return empty object when records empty", () => {
      const records = selectors.selectAgency(stateWithNoRecords);
      expect(records).to.be.undefined;
    });
  });

  describe("selectAuthErrors", () => {
    it("should return records meta", () => {
      const meta = selectors.selectAuthErrors(stateWithRecords);
      expect(meta).to.deep.equal("");
    });

    it("should return empty object when records empty", () => {
      const meta = selectors.selectAuthErrors(stateWithNoRecords);
      expect(meta).to.deep.equal("");
    });
  });

  describe("selectAuthenticated", () => {
    it("should return records meta", () => {
      const meta = selectors.selectAuthenticated(stateWithRecords);
      expect(meta).to.deep.equal(true);
    });

    it("should return empty object when records empty", () => {
      const meta = selectors.selectAuthenticated(stateWithNoRecords);
      expect(meta).to.deep.equal(false);
    });
  });
});
