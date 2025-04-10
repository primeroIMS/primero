// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import uuid from "../../libs/uuid";
import queueIndexedDB from "../../db/queue";

import queueFetch from "./queue-fetch";

describe("middleware/utils/queue-fetch.js", () => {
  describe("when fetch is queued", () => {
    let queue;

    beforeEach(() => {
      jest.spyOn(uuid, "v4").mockReturnValue("1234");
      queue = jest.spyOn(queueIndexedDB, "add").mockResolvedValue();
    });

    it("queues the action", async () => {
      const action = {
        type: "fetch-action",
        api: {}
      };

      await queueFetch(action);

      expect(queue).toHaveBeenCalledWith({ ...action, fromQueue: "1234" });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });
});
