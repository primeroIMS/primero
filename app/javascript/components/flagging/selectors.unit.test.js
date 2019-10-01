import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";

import * as selectors from "./selectors";
import { FlagRecord } from "./records";

chai.use(chaiImmutable);

const state = Map({
  records: Map({
    flags: Map({
      data: List([
        FlagRecord({ record_id: 1, record_type: "cases" }),
        FlagRecord({ record_id: 2, record_type: "incidents" }),
        FlagRecord({ record_id: 2, record_type: "cases" }),
        FlagRecord({ record_id: 2, record_type: "cases" })
      ])
    })
  })
});

describe("<Flagging /> - Selectors", () => {
  const recordType = "cases";

  describe("selectFlags", () => {
    it("should return list of flags", () => {
      const expected = List([
        FlagRecord({ record_id: 2, record_type: "cases" }),
        FlagRecord({ record_id: 2, record_type: "cases" })
      ]);
      const records = selectors.selectFlags(state, 2, recordType);
      expect(records).to.deep.equal(expected);
    });

    it("should return empty list when no flags", () => {
      const expected = List([]);
      const records = selectors.selectFlags(state, 3, recordType);
      expect(records).to.deep.equal(expected);
    });
  });
});
