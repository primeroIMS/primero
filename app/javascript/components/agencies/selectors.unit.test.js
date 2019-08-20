import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";
import * as Record from "./records";

import * as selectors from "./selectors";

chai.use(chaiImmutable);

const stateWithNoRecords = Map({});
const stateWithRecords = Map({
  agencies: Map({
    data: Map({
      0: Record.AgencyRecord({
        unique_id: "agency-unicef",
        name: "UNICEF",
        logo: {
          small: "/rails/active_storage/blobs/jeff.png"
        }
      })
    })
  })
});

describe("Agencies - Selectors", () => {
  describe("selectAgencies", () => {
    it("should return records", () => {
      const expected = Map({
        0: Record.AgencyRecord({
          unique_id: "agency-unicef",
          name: "UNICEF",
          logo: {
            small: "/rails/active_storage/blobs/jeff.png"
          }
        })
      });
      const records = selectors.selectAgencies(stateWithRecords);
      expect(records.toJS()).to.deep.equal(expected.toJS());
    });

    it("should return empty object when records empty", () => {
      const records = selectors.selectAgencies(stateWithNoRecords);
      expect(records).to.be.empty;
    });
  });
});
