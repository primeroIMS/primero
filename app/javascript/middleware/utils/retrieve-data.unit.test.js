import { stub, createMockStore } from "../../test";
import * as syncIndexedDB from "../../db/sync";

import retrieveData from "./retrieve-data";
import * as offlineDispatchSuccess from "./offline-dispatch-success";

describe("middleware/utils/retrieve-data.js", () => {
  const store = createMockStore();

  it("sync indexeddb and calls offlineDispatchSuccess", async () => {
    const action = {
      type: "test-action",
      db: {
        collection: "forms"
      }
    };
    const resolvedData = {
      data: [{ field: "test" }]
    };
    const syncDB = stub(syncIndexedDB, "default").resolves(resolvedData);
    const success = stub(offlineDispatchSuccess, "default");

    await retrieveData(store, action);

    expect(success).to.have.been.calledWith(store, action, resolvedData);
    syncDB.restore();
    success.restore();
  });

  it("displays errors in console", async () => {
    const action = {
      type: "test-action",
      db: {
        collection: "forms"
      }
    };

    const consoleError = stub(console, "error");
    const syncDB = stub(syncIndexedDB, "default").rejects("error happened");

    await retrieveData(store, action);

    expect(consoleError).to.have.been.called;

    consoleError.restore();
    syncDB.restore();
  });
});
