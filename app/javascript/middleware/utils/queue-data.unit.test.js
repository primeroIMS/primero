import uuid from "uuid";

import { stub, createMockStore } from "../../test";
import * as syncIndexedDB from "../../db/sync";
import queueIndexedDB from "../../db/queue";

import queueData from "./queue-data";
import * as offlineDispatchSuccess from "./offline-dispatch-success";
import * as withGeneratedProperties from "./with-generated-properties";

describe("middleware/utils/retrieve-data.js", () => {
  const store = createMockStore();

  it("sync indexeddb and calls offlineDispatchSuccess", async () => {
    const action = {
      type: "test-action",
      api: {},
      db: {
        collection: "forms"
      }
    };
    const resolvedData = {
      data: [{ field: "test" }]
    };
    const generatedProperties = stub(
      withGeneratedProperties,
      "default"
    ).returns({ ...action, fromQueue: "1234" });

    const id = stub(uuid, "v4").returns("1234");
    const queue = stub(queueIndexedDB, "add").resolves();
    const syncDB = stub(syncIndexedDB, "default").resolves(resolvedData);
    const success = stub(offlineDispatchSuccess, "default");

    await queueData(store, action);

    expect(queue).to.have.been.calledWith({ ...action, fromQueue: "1234" });
    expect(success).to.have.been.calledWith(store, action, resolvedData);

    generatedProperties.restore();
    syncDB.restore();
    queue.restore();
    success.restore();
    id.restore();
  });

  it("displays errors in console", async () => {
    const action = {
      type: "test-action",
      api: {},
      db: {
        collection: "forms"
      }
    };

    const consoleError = stub(console, "error");
    const syncDB = stub(syncIndexedDB, "default").rejects("error happened");

    await queueData(store, action);

    expect(consoleError).to.have.been.called;

    consoleError.restore();
    syncDB.restore();
  });
});
