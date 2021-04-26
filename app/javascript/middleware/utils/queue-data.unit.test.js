import uuid from "uuid";

import { stub, createMockStore } from "../../test";
import * as syncIndexedDB from "../../db/sync";
import queueIndexedDB from "../../db/queue";
import { METHODS } from "../../config";

import queueData from "./queue-data";
import * as handleOfflineAttachments from "./handle-offline-attachments";
import * as offlineDispatchSuccess from "./offline-dispatch-success";
import * as withGeneratedProperties from "./with-generated-properties";

describe.skip("middleware/utils/retrieve-data.js", () => {
  const { store } = createMockStore();

  context("when data is queued", () => {
    const resolvedData = { data: [{ field: "test" }] };
    let generatedProperties;
    let id;
    let syncDB;
    let success;
    let queue;
    let skipSynced;
    let dbPayload;

    const action = {
      type: "test-action",
      api: {},
      db: {
        collection: "forms"
      }
    };

    beforeEach(() => {
      id = stub(uuid, "v4").returns("1234");
      skipSynced = stub(handleOfflineAttachments, "skipSyncedAttachments").resolves(action);
      dbPayload = stub(handleOfflineAttachments, "buildDBPayload").resolves(resolvedData);
      queue = stub(queueIndexedDB, "add").resolves();
      syncDB = stub(syncIndexedDB, "default").resolves(resolvedData);
      success = stub(offlineDispatchSuccess, "default");
    });

    it("syncs indexeddb and calls offlineDispatchSuccess", async () => {
      generatedProperties = stub(withGeneratedProperties, "default").returns({ ...action, fromQueue: "1234" });

      await queueData(store, action);

      expect(queue).to.have.been.calledWith({ ...action, fromQueue: "1234" });
      expect(success).to.have.been.calledWith(store, action, resolvedData);
    });

    afterEach(() => {
      syncDB.restore();
      queue.restore();
      success.restore();
      id.restore();
      generatedProperties?.restore();
      skipSynced.restore();
      dbPayload.restore();
    });
  });

  context("when has errored", () => {
    let consoleError;
    let syncDB;
    let skipSynced;
    let dbPayload;

    beforeEach(() => {
      consoleError = stub(console, "error");
      skipSynced = stub(handleOfflineAttachments, "skipSyncedAttachments").resolves({});
      dbPayload = stub(handleOfflineAttachments, "buildDBPayload").resolves({});
      syncDB = stub(syncIndexedDB, "default").rejects("error happened");
    });

    it("displays errors in console", async () => {
      const action = {
        type: "test-action",
        api: { method: METHODS.POST },
        db: {
          collection: "forms"
        }
      };

      await queueData(store, action);

      expect(consoleError).to.have.been.called;
    });

    afterEach(() => {
      consoleError.restore();
      syncDB.restore();
      skipSynced.restore();
      dbPayload.restore();
    });
  });
});
