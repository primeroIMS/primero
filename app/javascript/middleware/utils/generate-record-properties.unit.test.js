// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import configureStore from "redux-mock-store";
import { fromJS } from "immutable";

import uuid from "../../libs/uuid";

import generateRecordProperties from "./generate-record-properties";

describe("middleware/utils/generate-record-properties.js", () => {
  const time = new Date("10/01/2020");

  const store = configureStore()(
    fromJS({
      user: {
        username: "jj"
      }
    })
  );

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(time);

    jest.spyOn(uuid, "v4").mockReturnValue("dd3b8e93-0cce-415b-ad2b-d06bb454b66f");
  });

  afterAll(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  describe("subforms", () => {
    it("generates unique_id for new subforms", () => {
      expect(generateRecordProperties(store, { method: "POST", subform: true }, false)).toEqual({
        unique_id: "dd3b8e93-0cce-415b-ad2b-d06bb454b66f"
      });
    });
  });

  describe("records", () => {
    it("generates full name if no name", () => {
      const payload = { body: { name_first: "Josh", name_last: "Anon" } };
      const { name } = generateRecordProperties(store, payload, true);

      expect(name).toBe("Josh Anon");
    });

    it("returns name", () => {
      const payload = {
        body: {
          name_first: "Josh",
          name_last: "Anon",
          name: "James Tob"
        }
      };
      const { name } = generateRecordProperties(store, payload, true);

      expect(name).toEqual("James Tob");
    });

    it("returns existing id", () => {
      const payload = {
        id: "1234",
        recordType: "testRecordType",
        body: {
          type: "testRecordType",
          owned_by: "aa",
          created_at: time
        }
      };

      const results = generateRecordProperties(store, payload, true);

      expect(results).toEqual({ id: "1234", complete: true });
    });

    it("generates missing record properties", () => {
      const expected = {
        created_at: time,
        id: "dd3b8e93-0cce-415b-ad2b-d06bb454b66f",
        complete: true,
        owned_by: "jj",
        record_in_scope: true,
        short_id: "454b66f",
        type: "testRecordType",
        enabled: true
      };
      const results = generateRecordProperties(store, { method: "POST", recordType: "testRecordType" }, true);

      expect(results).toEqual(expected);
    });
  });
});
