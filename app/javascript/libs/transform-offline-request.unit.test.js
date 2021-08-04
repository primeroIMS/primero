import DB from "../db/db";
import { DB_STORES } from "../db/constants";
import { DATE_FIELD, NUMERIC_FIELD } from "../components/record-form/constants";
import { METHODS } from "../config";

import transformOfflineRequest from "./transform-offline-request";

describe("transformOfflineRequest", () => {
  beforeEach(done => {
    const promise = new Promise((resolve, reject) => {
      Promise.all([
        DB.add(DB_STORES.FIELDS, {
          name: "first_name"
        }),
        DB.add(DB_STORES.FIELDS, {
          name: "age",
          type: NUMERIC_FIELD
        }),
        DB.add(DB_STORES.FIELDS, {
          name: "date_of_birth",
          type: DATE_FIELD
        })
      ])
        .then(resolve)
        .catch(reject);

      setTimeout(() => {
        reject(new Error("transform-offline-request.unit.test.js: Timeout executed"));
      }, 1000);
    });

    promise.then(() => done()).catch(done);
  });

  afterEach(done => {
    const promise = new Promise((resolve, reject) => {
      DB.clearDB().then(resolve).catch(reject);

      setTimeout(() => {
        reject(new Error("transform-offline-request.unit.test.js: Timeout executed"));
      }, 1000);
    });

    promise.then(() => done()).catch(done);
  });

  it("should transform numeric and date fields", done => {
    const action = {
      api: {
        body: { data: { first_name: "First Name", age: "10", date_of_birth: "12-10-2010" } },
        method: METHODS.POST
      }
    };

    const expected = {
      api: {
        body: { data: { first_name: "First Name", age: 10, date_of_birth: "12-10-2010" } },
        method: METHODS.POST
      }
    };

    const promise = new Promise((resolve, reject) => {
      transformOfflineRequest(action)
        .then(result => {
          expect(result).to.deep.equals(expected);
          resolve();
        })
        .catch(reject);

      setTimeout(() => {
        reject(new Error("transform-offline-request.unit.test.js: Timeout executed"));
      }, 1000);
    });

    promise.then(() => done()).catch(done);
  });
});
