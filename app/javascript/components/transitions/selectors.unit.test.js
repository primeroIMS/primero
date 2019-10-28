import { expect } from "test/test.setup";
import { Map, List } from "immutable";
import * as selectors from "./selectors";
import { TransitionRecord } from "./records";

const dataExpected = List([
  TransitionRecord({
    id: "ee1ddfad-cc11-42df-9f39-14c7e6a3c1bb",
    record_id: "6b0018e7-d421-4d6b-80bf-ca4cbf488907",
    status: "inprogress",
    type: "Transfer",
    record_type: "case"
  }),
  TransitionRecord({
    id: "4142488e-ccd9-4ac5-a3c1-c3c0fd063fc8",
    record_id: "6b0018e7-d421-4d6b-80bf-ca4cbf488907",
    status: "done",
    type: "Assign",
    record_type: "case"
  })
]);
const state = Map({
  records: Map({
    transitions: Map({
      data: dataExpected
    })
  })
});

describe("<Transitions /> - Selectors", () => {
  const recordType = "cases";

  describe("selectTransitions", () => {
    it("should return list of transitions", () => {
      const records = selectors.selectTransitions(
        state,
        recordType,
        "6b0018e7-d421-4d6b-80bf-ca4cbf488907"
      );
      expect(records).to.deep.equal(dataExpected);
    });

    it("should return empty list when no transitions", () => {
      const expected = List([]);
      const records = selectors.selectTransitions(state, recordType, 3);
      expect(records).to.deep.equal(expected);
    });
  });
});
