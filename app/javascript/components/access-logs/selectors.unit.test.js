// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, List } from "immutable";

import { getAccessLogs, getAccessLogLoading, getAccessLogMetadata } from "./selectors";
import { AccessLogsRecord } from "./records";
import NAMESPACE from "./namespace";

describe("AccessLogs - Selectors", () => {
  describe("getAccessLogs", () => {
    const state = fromJS({
      records: {
        [NAMESPACE]: {
          data: [
            AccessLogsRecord({
              record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
              record_type: "cases",
              timestamp: "2020-08-11T10:27:33Z",
              user_name: "primero",
              full_name: "SuperUser",
              action: "update",
              role_name: "My Role"
            })
          ],
          loading: false,
          metadata: { page: 1, per: 2, total: 3 }
        }
      }
    });

    it("should return accessLogs data records", () => {
      const expected = List([state.getIn(["records", NAMESPACE, "data"]).first()]);

      expect(getAccessLogs(state, "38c82975-99aa-4798-9c3d-dabea104d992", "cases")).toEqual(expected);
    });

    it("should return accessLogs loading records", () => {
      const expected = AccessLogsRecord({
        record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
        record_type: "cases",
        timestamp: "2020-08-11T10:27:33Z",
        user_name: "primero",
        full_name: "SuperUser",
        action: "show",
        role_name: "My Role"
      });

      const result = getAccessLogLoading(state);

      expect(result).toBeFalsy();
    });

    it("should return accessLogs metadata records", () => {
      const expected = { page: 1, per: 2, total: 3 };
      const result = getAccessLogMetadata(state);

      expect(result.toObject()).toEqual(expected);
    });
  });
});
