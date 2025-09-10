// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, List } from "immutable";

import { getChangeLogs, getChangeLogLoading, getChangeLogMetadata } from "./selectors";
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
          ],
          loading: true,
          metadata: {
            total: 2,
            per: 20,
            page: 1
          }
        }
      }
    });

    it("should return the correct value", () => {
      const expected = List([state.getIn(["records", NAMESPACE, "data"]).first()]);

      expect(getChangeLogs(state, "38c82975-99aa-4798-9c3d-dabea104d992", "cases")).toEqual(expected);
    });
  });

  describe("getChangeLogLoading", () => {
    const state = fromJS({
      records: {
        changeLogs: {
          data: [],
          loading: false,
          metada: {
            total: 2,
            per: 20,
            page: 1
          }
        }
      }
    });

    it("returns the loading state for ChangeLogs", () => {
      const result = getChangeLogLoading(state);

      expect(result).toBeFalsy();
    });
  });

  describe("getChangeLogMetadata", () => {
    const state = fromJS({
      records: {
        changeLogs: {
          data: [],
          loading: false,
          metadata: {
            total: 2,
            per: 20,
            page: 1
          }
        }
      }
    });

    it("returns the loading state for ChangeLogs", () => {
      const expected = {
        total: 2,
        per: 20,
        page: 1
      };
      const result = getChangeLogMetadata(state);

      expect(result.toJS()).toEqual(expected);
    });
  });
});
