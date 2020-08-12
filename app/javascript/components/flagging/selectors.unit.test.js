import { Map, List } from "immutable";

import { selectFlags, getActiveFlags, getResolvedFlags } from "./selectors";
import { FlagRecord } from "./records";

const state = Map({
  records: Map({
    flags: Map({
      data: List([
        FlagRecord({ record_id: 1, record_type: "cases" }),
        FlagRecord({ record_id: 2, record_type: "incidents" }),
        FlagRecord({ record_id: 2, record_type: "cases" }),
        FlagRecord({ record_id: 2, record_type: "cases", removed: true })
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
        FlagRecord({ record_id: 2, record_type: "cases", removed: true })
      ]);
      const records = selectFlags(state, 2, recordType);

      expect(records).to.deep.equal(expected);
    });

    it("should return empty list when no flags", () => {
      const expected = List([]);
      const records = selectFlags(state, 3, recordType);

      expect(records).to.deep.equal(expected);
    });
  });

  describe("getActiveFlags", () => {
    const expected = List([FlagRecord({ record_id: 2, record_type: "cases" })]);

    it("should return the correct value", () => {
      expect(getActiveFlags(state, 2, "cases")).to.deep.equal(expected);
    });
  });

  describe("getResolvedFlags", () => {
    const expected = List([FlagRecord({ record_id: 2, record_type: "cases", removed: true })]);

    it("should return the correct value", () => {
      expect(getResolvedFlags(state, 2, "cases")).to.deep.equal(expected);
    });
  });
});
