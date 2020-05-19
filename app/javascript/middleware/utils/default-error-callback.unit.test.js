import configureStore from "redux-mock-store";

import { spy } from "../../test";

import defaultErrorCallback from "./default-error-callback";
import * as handleRestCallback from "./handle-rest-callback";

describe("middleware/utils/default-error-callback.js", () => {
  const store = configureStore()();

  it("calls handleRestCallback if response not 401", () => {
    const response = { status: 500 };

    const errorPayload = [
      {
        action: "notifications/ENQUEUE_SNACKBAR",
        payload: {
          messageKey: "errors.api.internal_server",
          options: {
            variant: "error",
            key: "internal_server"
          }
        }
      },
      {
        action: "SET_DIALOG_PENDING",
        payload: {
          pending: false
        }
      }
    ];

    const handleRestCallbackSpy = spy(handleRestCallback, "default");

    defaultErrorCallback(store, response, {});
    expect(handleRestCallbackSpy).to.have.been.calledOnceWith(
      store,
      errorPayload,
      response,
      {}
    );
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
          options: {
            variant: "error",
            key: "internal_server"
          }
        }
      },
      {
        action: "SET_DIALOG_PENDING",
        payload: {
          pending: false
        }
      }
    ];

    const handleRestCallbackSpy = spy(handleRestCallback, "default");

    defaultErrorCallback(store, response, json);
    expect(handleRestCallbackSpy).to.have.been.calledOnceWith(
      store,
      errorPayload,
      response,
      json
    );
  });

  it("does not call handleRestCallback if response 401", () => {
    const response = { status: 401 };

    const handleRestCallbackSpy = spy(handleRestCallback, "default");

    defaultErrorCallback(store, response, {});
    expect(handleRestCallbackSpy).to.not.have.been.called;
  });
});
