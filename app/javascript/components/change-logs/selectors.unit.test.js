import { fromJS, List } from "immutable";

import { getChangeLogs } from "./selectors";
import { ChangeLogsRecord } from "./records";
import NAMESPACE from "./namespace";

describe("ChangeLogs - Selectors", () => {
  describe("getChangeLogs", () => {
    const state = fromJS({
      records: {
        changeLogs: {
          data: [
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
          ]
        }
      }
    });

    it("should return the correct value", () => {
      const expected = List([state.getIn(["records", NAMESPACE, "data"]).first()]);

      expect(getChangeLogs(state, "38c82975-99aa-4798-9c3d-dabea104d992", "cases")).to.deep.equal(expected);
    });

    it("should return only those changes for the form fields", () => {
      const expected = ChangeLogsRecord({
        record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
        record_type: "cases",
        datetime: "2020-08-11T10:27:33Z",
        user_name: "primero",
        action: "update",
        record_changes: [{ religion: { to: ["christianity"], from: null } }]
      });

      const result = getChangeLogs(
        state,
        "38c82975-99aa-4798-9c3d-dabea104d992",
        "cases",
        [
          {
            unique_id: "basic_form",
            fields: [{ name: "religion" }]
          }
        ],
        fromJS({ form_unique_ids: ["basic_form"] })
      );

      expect(expected.toObject()).to.deep.equal(result.first().toObject());
    });

    it("should return only those changes for the field names", () => {
      const expected = ChangeLogsRecord({
        record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
        record_type: "cases",
        datetime: "2020-08-11T10:27:33Z",
        user_name: "primero",
        action: "update",
        record_changes: [{ name_nickname: { to: "Pat", from: null } }]
      });

      const result = getChangeLogs(
        state,
        "38c82975-99aa-4798-9c3d-dabea104d992",
        "cases",
        null,
        fromJS({
          field_names: ["name_nickname"]
        })
      );

      expect(expected.toObject()).to.deep.equal(result.first().toObject());
    });
  });
});
