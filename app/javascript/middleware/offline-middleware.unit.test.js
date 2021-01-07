import { createMiddleware, spy } from "../test";
import { METHODS } from "../config";

import offlineMiddleware from "./offline-middleware";
import * as queueData from "./utils/queue-data";
import * as queueFetch from "./utils/queue-fetch";
import * as retrieveData from "./utils/retrieve-data";

describe("middleware/offline-middleware.js", () => {
  const setupMiddleware = online =>
    createMiddleware(offlineMiddleware, {
      application: { online }
    });

  describe("passes through", () => {
    it("non api action", () => {
      const { next, invoke } = setupMiddleware();
      const action = { type: "TEST" };

      invoke(action);
      expect(next).to.have.been.calledWith(action);
    });

    it("online", () => {
      const { next, invoke } = setupMiddleware(true);
      const action = { type: "TEST" };

      invoke(action);
      expect(next).to.have.been.calledWith(action);
    });
  });

  describe("offline GET", () => {
    let retrieveDataSpy;
    let queueFetchSpy;

    beforeEach(() => {
      queueFetchSpy = spy(queueFetch, "default");
      retrieveDataSpy = spy(retrieveData, "default");
    });

    afterEach(() => {
      retrieveDataSpy.restore();
      queueFetchSpy.restore();
    });

    it("invokes retrieveData with args", () => {
      const { invoke, store } = setupMiddleware(false);

      const action = {
        type: "TEST",
        api: { path: "/" }
      };

      invoke(action);
      expect(retrieveDataSpy).to.have.been.calledWith(store, action);
    });

    it("does not invoke retrieveData if skipDB is true", () => {
      const { invoke } = setupMiddleware(false);

      const action = {
        type: "TEST",
        api: { path: "/", skipDB: true }
      };

      invoke(action);
      expect(retrieveDataSpy).to.not.have.been.called;
    });

    it("queues the request if queueOffline is true", () => {
      const { invoke } = setupMiddleware(false);

      const action = {
        type: "queue_get_action",
        api: { path: "/", queueOffline: true }
      };

      invoke(action);

      expect(queueFetchSpy).to.have.been.calledWith(action);
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
      queueDataSpy = spy(queueData, "default");
    });

    afterEach(() => {
      queueDataSpy.restore();
    });

    it("queues actions", () => {
      const { invoke, store } = setupMiddleware(false);

      testMethods(method => {
        const action = buildAction(method);

        invoke(action);
        expect(queueDataSpy).to.have.been.calledWith(store, action);
      });
    });

    it("skips previously queued actions", () => {
      const { invoke, next } = setupMiddleware(false);

      testMethods(method => {
        const action = buildAction(method, true);

        invoke(action);

        expect(queueDataSpy).to.have.not.been.called;
        expect(next).to.have.been.calledWith(action);
      });
    });
  });
});
