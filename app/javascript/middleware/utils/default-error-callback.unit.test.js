import configureStore from "redux-mock-store";

import { RECORD_TYPES } from "../../config";
import { spy } from "../../test";

import defaultErrorCallback from "./default-error-callback";
import * as handleRestCallback from "./handle-rest-callback";

describe("middleware/utils/default-error-callback.js", () => {
  const store = configureStore()();
  let handleRestCallbackSpy;

  beforeEach(() => {
    handleRestCallbackSpy = spy(handleRestCallback, "default");
  });

  afterEach(() => {
    handleRestCallbackSpy.restore();
  });

  it("calls handleRestCallback if response not 401", () => {
    const response = { status: 500 };

    const errorPayload = [
      {
        action: "notifications/ENQUEUE_SNACKBAR",
        payload: {
          messageKey: "errors.api.internal_server",
          messageDetailed: undefined,
          options: {
            variant: "error",
            key: "internal_server"
          }
        }
      },
      {
        action: "SET_DIALOG_PENDING",
        payload: false
      }
    ];

    defaultErrorCallback({ store, response });
    expect(handleRestCallbackSpy).to.have.been.calledOnceWith(store, errorPayload, response, {});
  });

  it("returns a sync update error for a record if fromQueue", () => {
    const response = { status: 500 };

    const errorPayload = [
      {
        action: "notifications/ENQUEUE_SNACKBAR",
        payload: {
          messageKey: "sync.error.update",
          messageParams: { short_id: "3456789" },
          messageDetailed: undefined,
          recordType: RECORD_TYPES.cases,
          options: {
            variant: "error",
            key: "record_sync_error_123456789"
          }
        }
      },
      {
        action: "SET_DIALOG_PENDING",
        payload: false
      }
    ];

    defaultErrorCallback({ store, response, recordType: RECORD_TYPES.cases, fromQueue: true, id: "123456789" });
    expect(handleRestCallbackSpy).to.have.been.calledOnceWith(store, errorPayload, response, {});
  });

  it("returns a sync create error if fromQueue", () => {
    const response = { status: 500 };

    const errorPayload = [
      {
        action: "notifications/ENQUEUE_SNACKBAR",
        payload: {
          messageKey: "sync.error.create",
          messageDetailed: undefined,
          recordType: RECORD_TYPES.cases,
          options: {
            variant: "error",
            key: "record_sync_error_create"
          }
        }
      },
      {
        action: "SET_DIALOG_PENDING",
        payload: false
      }
    ];

    defaultErrorCallback({ store, response, recordType: RECORD_TYPES.cases, fromQueue: true });
    expect(handleRestCallbackSpy).to.have.been.calledOnceWith(store, errorPayload, response, {});
  });

  it("extracts errors from json", () => {
    const response = { status: 500 };
    const json = {
      errors: [
        {
          message: "test error"
        },
        {
          message: "test error 2"
        }
      ]
    };

    const errorPayload = [
      {
        action: "notifications/ENQUEUE_SNACKBAR",
        payload: {
          messageKey: "test error, test error 2",
          messageDetailed: undefined,
          options: {
            variant: "error",
            key: "internal_server"
          }
        }
      },
      {
        action: "SET_DIALOG_PENDING",
        payload: false
      }
    ];

    defaultErrorCallback({ store, response, json });
    expect(handleRestCallbackSpy).to.have.been.calledOnceWith(store, errorPayload, response, json);
  });

  it("does not call handleRestCallback if response 401", () => {
    const response = { status: 401 };

    defaultErrorCallback({ store, response });
    expect(handleRestCallbackSpy).to.not.have.been.called;
  });
});
