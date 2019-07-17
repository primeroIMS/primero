import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";

import * as selectors from "./selectors";

chai.use(chaiImmutable);

const stateWithNoRecords = Map({});
const stateWithRecords = Map({
  records: Map({
    Support: Map({
      data: {
        name: "Simon Nehme",
        organization: "UNICEF",
        position: "Child Protection Officer - CPIMS Administrator",
        phone: "+961 70 673 187",
        email: "snehme@unicef.org",
        location: "United Nations Children’s Fund Lebanon",
        support_forum: "https://google.com",
        other_information: "",
        primero_version: "1.3.15"
      }
    })
  })
});

describe("<Support /> - Selectors", () => {

  describe("selectSupportData", () => {
    it("should return records", () => {
      const expected = {
        name: "Simon Nehme",
        organization: "UNICEF",
        position: "Child Protection Officer - CPIMS Administrator",
        phone: "+961 70 673 187",
        email: "snehme@unicef.org",
        location: "United Nations Children’s Fund Lebanon",
        support_forum: "https://google.com",
        other_information: "",
        primero_version: "1.3.15"
      };

      const records = selectors.selectSupportData(stateWithRecords);
      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const expected = Map({});
      const records = selectors.selectSupportData(stateWithNoRecords);
      expect(records).to.deep.equal(expected);
    });
  });

});
