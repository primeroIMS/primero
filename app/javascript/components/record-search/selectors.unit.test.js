import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";

import * as selectors from "./selectors";

chai.use(chaiImmutable);

const stateWithNoRecords = Map({});
const stateWithRecords = Map({
  records: Map({
    Cases: Map({
      data: List([
        Map({
          id: "e951ff69-3eff-43df-843c-2db4b202957b",
          name: "Test One",
          created_at: "2019-07-30T21:29:45.113Z",
          case_id_display: "d2e838e"
        }),
        Map({
          id: "2b8d6be1-1dc4-483a-8640-4cfe87c71610",
          name: "Test Two",
          created_at: "2019-07-20T21:29:45.040Z",
          case_id_display: "d8f7010"
        })
      ]),
      metadata: Map({ per: 20, page: 1 }),
      filters: Map({ status: "open", query: "test" })
    })
  })
});

describe("<RecordList /> - Selectors", () => {
  const recordType = "Cases";

  describe("selectSearchValue", () => {
    it("should return records", () => {
      const expected = "test";
      const records = selectors.selectSearchValue(stateWithRecords, recordType);
      expect(records).to.deep.equal(expected);
    });

    it("should return empty object when records empty", () => {
      const expected = "";
      const records = selectors.selectSearchValue(
        stateWithNoRecords,
        recordType
      );
      expect(records).to.deep.equal(expected);
    });
  });

});
