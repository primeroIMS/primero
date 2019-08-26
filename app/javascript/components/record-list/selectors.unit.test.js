import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";

import * as selectors from "./selectors";

chai.use(chaiImmutable);

const stateWithNoRecords = Map({});
const stateWithRecords = Map({
  records: Map({
    TestRecordType: Map({
      loading: true,
      data: List([Map({ id: 1 })]),
      filters: Map({
        gender: "male"
      }),
      metadata: Map({ per: 20 })
    })
  })
});

describe("<RecordList /> - Selectors", () => {
  const recordType = "TestRecordType";

  describe("selectListHeaders", () => {
    it("should return records", () => {
      const expected = List([Map({ id: 1 })]);
      const records = selectors.selectRecords(stateWithRecords, recordType);
      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const expected = List([]);
      const records = selectors.selectRecords(stateWithNoRecords, recordType);
      expect(records).to.deep.equal(expected);
    });
  });
});
