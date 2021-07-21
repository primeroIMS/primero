import DB from "../db/db";
import { DB_STORES } from "../db/constants";
import { DATE_FIELD, NUMERIC_FIELD } from "../components/record-form/constants";

import transformOfflineRequest from "./transform-offline-request";

describe("transformOfflineRequest", () => {
  beforeEach(async () => {
    await Promise.all([
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
    ]);
  });

  afterEach(async () => {
    await DB.clearDB();
  });

  it("should transform numeric and date fields", async () => {
    const action = {
      api: {
        body: { data: { first_name: "First Name", age: "10", date_of_birth: "12-10-2010" } },
        method: "post"
      }
    };

    const expected = {
      api: {
        body: { data: { first_name: "First Name", age: 10, date_of_birth: "12-10-2010" } },
        method: "post"
      }
    };

    const result = await transformOfflineRequest(action);

    expect(result).to.deep.equals(expected);
  });
});
