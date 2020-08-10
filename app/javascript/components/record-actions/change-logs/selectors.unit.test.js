import { Map, List } from "immutable";

import { getChangeLogs } from "./selectors";
import { ChangeLogsRecord } from "./records";
import NAMESPACE from "./namespace";

describe("ChangeLogs - Selectors", () => {
  describe("getChangeLogs", () => {
    const state = Map({
      records: Map({
        changeLogs: Map({
          data: List([
            ChangeLogsRecord({
              record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
              record_type: "cases",
              datetime: "2020-08-11T10:27:33Z",
              user_name: "primero",
              action: "update",
              record_changes: [
                { religion: { to: ["christianity"], from: null } },
                { name_nickname: { to: "Pat", from: null } },
                { national_id_no: { to: "0050M", from: null } }
              ]
            }),
            ChangeLogsRecord({
              record_id: "12c3456-88aa-0025-6a9f-edcba104d992",
              record_type: "cases",
              datetime: "2020-08-10T18:27:33Z",
              user_name: "primero",
              action: "update",
              record_changes: [
                { religion: { to: ["islam"], from: null } },
                { national_id_no: { to: "0034M", from: null } }
              ]
            })
          ])
        })
      })
    });

    const expected = List([
      state.getIn(["records", NAMESPACE, "data"]).first()
    ]);

    it("should return the correct value", () => {
      expect(
        getChangeLogs(state, "38c82975-99aa-4798-9c3d-dabea104d992", "cases")
      ).to.deep.equal(expected);
    });
  });
});
