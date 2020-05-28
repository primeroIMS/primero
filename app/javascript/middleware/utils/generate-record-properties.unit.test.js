import configureStore from "redux-mock-store";
import { fromJS } from "immutable";
import uuid from "uuid";

import { stub, useFakeTimers } from "../../test";

import generateRecordProperties from "./generate-record-properties";

describe("middleware/utils/generate-record-properties.js", () => {
  let clock;
  const time = new Date("10/01/2020");

  const store = configureStore()(
    fromJS({
      user: {
        username: "jj"
      }
    })
  );

  before(() => {
    clock = useFakeTimers(time);
    stub(uuid, "v4").returns("dd3b8e93-0cce-415b-ad2b-d06bb454b66f");
  });

  after(() => {
    clock.restore();
    uuid.v4.restore();
  });

  describe("subforms", () => {
    it("generates unique_id for new subforms", () => {
      expect(
        generateRecordProperties(
          store,
          { method: "POST", subform: true },
          false
        )
      ).to.deep.equal({ unique_id: "dd3b8e93-0cce-415b-ad2b-d06bb454b66f" });
    });
  });

  describe("records", () => {
    it("generates full name if no name", () => {
      const payload = { body: { name_first: "Josh", name_last: "Anon" } };
      const { name } = generateRecordProperties(store, payload, true);

      expect(name).to.equal("Josh Anon");
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

      expect(name).to.deep.equal("James Tob");
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

      expect(results).to.deep.equal({ id: "1234" });
    });

    it("generates missing record properties", () => {
      const expected = {
        created_at: time,
        id: "dd3b8e93-0cce-415b-ad2b-d06bb454b66f",
        owned_by: "jj",
        short_id: "454b66f",
        type: "testRecordType"
      };
      const results = generateRecordProperties(
        store,
        { method: "POST", recordType: "testRecordType" },
        true
      );

      expect(results).to.deep.equal(expected);
    });

    describe("cases", () => {
      it("generates case_id_display", () => {
        // eslint-disable-next-line camelcase
        const { case_id_display } = generateRecordProperties(
          store,
          { method: "POST", recordType: "cases" },
          true
        );

        expect(case_id_display).to.equal("454b66f");
      });
    });
  });
});
