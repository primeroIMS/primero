import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";
import * as Record from "./records";

import * as selectors from "./selectors";

chai.use(chaiImmutable);

const stateWithNoRecords = Map({});
const stateWithRecords = Map({
  modules: Map({
    data: Map({
      0: Record.ModulesRecord({
        unique_id: "primeromodule-cp",
        name: "CP"
      }),
      1: Record.ModulesRecord({
        unique_id: "primeromodule-gbv",
        name: "GBV"
      })
    })
  })
});

describe("Modules - Selectors", () => {
  describe("selectUserModules", () => {
    it("should return records", () => {
      const expected = Map({
        0: Record.ModulesRecord({
          unique_id: "primeromodule-cp",
          name: "CP"
        }),
        1: Record.ModulesRecord({
          unique_id: "primeromodule-gbv",
          name: "GBV"
        })
      });
      const records = selectors.selectUserModules(stateWithRecords);
      expect(records.toJS()).to.deep.equal(expected.toJS());
    });

    it("should return empty object when records empty", () => {
      const records = selectors.selectUserModules(stateWithNoRecords);
      expect(records).to.be.empty;
    });
  });
});
