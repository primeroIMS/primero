// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { createMockStore } from "../../test-utils";
import * as syncIndexedDB from "../../db/sync";

import retrieveData from "./retrieve-data";
import * as offlineDispatchSuccess from "./offline-dispatch-success";

jest.mock("./offline-dispatch-success", () => {
  const originalModule = jest.requireActual("./offline-dispatch-success");

  return {
    __esModule: true,
    ...originalModule
  };
});

jest.mock("../../db/sync", () => {
  const originalModule = jest.requireActual("../../db/sync");

  return {
    __esModule: true,
    ...originalModule
  };
});

describe("middleware/utils/retrieve-data.js", () => {
  const { store } = createMockStore();

  afterEach(() => {
    jest.resetAllMocks();
  });

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

    jest.spyOn(syncIndexedDB, "default").mockResolvedValue(resolvedData);
    const success = jest.spyOn(offlineDispatchSuccess, "default");

    await retrieveData(store, action);

    expect(success).toHaveBeenCalledWith(store, action, resolvedData);
  });

  it("displays errors in console", async () => {
    const action = {
      type: "test-action",
      db: {
        collection: "forms"
      }
    };

    const consoleError = jest.spyOn(global.console, "error");

    jest.spyOn(syncIndexedDB, "default").mockRejectedValue("error happened");

    await retrieveData(store, action);

    expect(consoleError).toHaveBeenCalled();
  });
});
