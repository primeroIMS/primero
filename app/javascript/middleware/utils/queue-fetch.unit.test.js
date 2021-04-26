import uuid from "uuid";

import { stub } from "../../test";
import queueIndexedDB from "../../db/queue";

import queueFetch from "./queue-fetch";

describe("middleware/utils/queue-fetch.js", () => {
  context("when fetch is queued", () => {
    let id;
    let queue;

    beforeEach(() => {
      id = stub(uuid, "v4").returns("1234");
      queue = stub(queueIndexedDB, "add").resolves();
    });

    it("queues the action", async () => {
      const action = {
        type: "fetch-action",
        api: {}
      };

      await queueFetch(action);

      expect(queue).to.have.been.calledWith({ ...action, fromQueue: "1234" });
    });

    afterEach(() => {
      queue.restore();
      id.restore();
    });
  });
});
