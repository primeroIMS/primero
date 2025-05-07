// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { createMiddleware } from "../test-utils";
import { METHODS } from "../config";

import offlineMiddleware from "./offline-middleware";
import * as queueData from "./utils/queue-data";
import * as queueFetch from "./utils/queue-fetch";
import * as retrieveData from "./utils/retrieve-data";

jest.mock("./utils/queue-data", () => {
  const originalModule = jest.requireActual("./utils/queue-data");

  return {
    __esModule: true,
    ...originalModule
  };
});

jest.mock("./utils/queue-fetch", () => {
  const originalModule = jest.requireActual("./utils/queue-fetch");

  return {
    __esModule: true,
    ...originalModule
  };
});

jest.mock("./utils/retrieve-data", () => {
  const originalModule = jest.requireActual("./utils/retrieve-data");

  return {
    __esModule: true,
    ...originalModule
  };
});

describe("middleware/offline-middleware.js", () => {
  const setupMiddleware = online =>
    createMiddleware(offlineMiddleware, {
      application: { online },
      connectivity: { serverOnline: online, online, fieldMode: false }
    });

  describe("passes through", () => {
    it("non api action", () => {
      const { next, invoke } = setupMiddleware();
      const action = { type: "TEST" };

      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    it("online", () => {
      const { next, invoke } = setupMiddleware(true);
      const action = { type: "TEST" };

      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });
  });

  describe("offline GET", () => {
    let retrieveDataSpy;
    let queueFetchSpy;

    beforeEach(() => {
      queueFetchSpy = jest.spyOn(queueFetch, "default");
      retrieveDataSpy = jest.spyOn(retrieveData, "default");
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("invokes retrieveData with args", () => {
      const { invoke, store } = setupMiddleware(false);

      const action = {
        type: "TEST",
        api: { path: "/" }
      };

      invoke(action);
      expect(retrieveDataSpy).toHaveBeenCalledWith(store, action);
    });

    it("does not invoke retrieveData if skipDB is true", () => {
      const { invoke } = setupMiddleware(false);

      const action = {
        type: "TEST",
        api: { path: "/", skipDB: true }
      };

      invoke(action);
      expect(retrieveDataSpy).not.toHaveBeenCalled();
    });

    it("queues the request if queueOffline is true", () => {
      const { invoke } = setupMiddleware(false);

      const action = {
        type: "queue_get_action",
        api: { path: "/", queueOffline: true }
      };

      invoke(action);

      expect(queueFetchSpy).toHaveBeenCalledWith(action);
    });
  });

  describe("offline POST,PUT,PATCH,DELETE", () => {
    let queueDataSpy;
    const buildAction = (action, fromQueue = false) => ({
      type: "TEST",
      api: { path: "/", method: action, queueOffline: true },
      fromQueue
    });

    const testMethods = assertion => [METHODS.DELETE, METHODS.PATCH, METHODS.POST, METHODS.PUT].forEach(assertion);

    beforeEach(() => {
      queueDataSpy = jest.spyOn(queueData, "default");
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("queues actions", () => {
      const { invoke, store } = setupMiddleware(false);

      testMethods(method => {
        const action = buildAction(method);

        invoke(action);
        expect(queueDataSpy).toHaveBeenCalledWith(store, action);
      });
    });

    it("skips previously queued actions", () => {
      const { invoke, next } = setupMiddleware(false);

      testMethods(method => {
        const action = buildAction(method, true);

        invoke(action);

        expect(queueDataSpy).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(action);
      });
    });
  });
});
