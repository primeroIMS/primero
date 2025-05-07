// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { createMockStore } from "../../test-utils";
import * as syncIndexedDB from "../../db/sync";
import queueIndexedDB from "../../db/queue";
import { METHODS } from "../../config";
import uuid from "../../libs/uuid";

import queueData from "./queue-data";
import * as handleOfflineAttachments from "./handle-offline-attachments";
import * as offlineDispatchSuccess from "./offline-dispatch-success";
import * as withGeneratedProperties from "./with-generated-properties";

describe.skip("middleware/utils/retrieve-data.js", () => {
  const { store } = createMockStore();

  describe("when data is queued", () => {
    const resolvedData = { data: [{ field: "test" }] };
    let success;
    let queue;

    const action = {
      type: "test-action",
      api: {},
      db: {
        collection: "forms"
      }
    };

    beforeEach(() => {
      jest.spyOn(uuid, "v4").mockReturnValue("1234");
      jest.spyOn(handleOfflineAttachments, "skipSyncedAttachments").mockResolvedValue(action);
      jest.spyOn(handleOfflineAttachments, "buildDBPayload").mockResolvedValue(resolvedData);
      jest.spyOn(queueIndexedDB, "add").mockResolvedValue();
      jest.spyOn(syncIndexedDB, "default").mockResolvedValue(resolvedData);
      success = jest.spyOn(offlineDispatchSuccess, "default");
    });

    it("syncs indexeddb and calls offlineDispatchSuccess", async () => {
      jest.spyOn(withGeneratedProperties, "default").mockReturnValue({ ...action, fromQueue: "1234" });

      await queueData(store, action);

      expect(queue).toHaveBeenCalledWith({ ...action, fromQueue: "1234" });
      expect(success).toHaveBeenCalledWith(store, action, resolvedData);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe("when has errored", () => {
    let consoleError;

    beforeEach(() => {
      consoleError = jest.spyOn(console, "error");
      jest.spyOn(handleOfflineAttachments, "skipSyncedAttachments").mockResolvedValue({});
      jest.spyOn(handleOfflineAttachments, "buildDBPayload").mockResolvedValue({});
      jest.spyOn(syncIndexedDB, "default").mockRejectedValue("error happened");
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

      expect(consoleError).toHaveBeenCalled();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });
});
