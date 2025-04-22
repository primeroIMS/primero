// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { createMockStore } from "../../test-utils";
import { generate } from "../../components/notifier";

import handleConfiguration from "./handle-configuration";

describe("middleware/utils/handle-configuration.js", () => {
  const { store } = createMockStore();
  const response = { url: "http://test.com/health/api" };
  const options = { baseUrl: "/api/v2" };
  const rest = {
    fetchSinglePayload: jest.fn(),
    fetchStatus: jest.fn(),
    type: "TEST"
  };

  beforeEach(() => {
    jest.spyOn(generate, "messageKey").mockReturnValue(4);
    jest.spyOn(store, "dispatch");
  });

  afterEach(() => {
    jest.restoreAllMocks();
    store.clearActions();
  });

  it("should call methods related to 503 response", () => {
    handleConfiguration(503, store, options, response, rest);
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: "application/DISABLE_NAVIGATION",
      payload: true
    });

    expect(actions[1]).toEqual({
      type: "notifications/ENQUEUE_SNACKBAR",
      payload: {
        noDismiss: true,
        options: { variant: "info", key: 4 },
        messageKey: "configurations.unavailable_server"
      }
    });
  });

  it("should call methods related to 204 response", () => {
    handleConfiguration(204, store, options, response, rest);

    const actions = store.getActions();

    expect(actions[0]).toEqual({
      type: "notifications/ENQUEUE_SNACKBAR",
      payload: {
        options: { variant: "success", key: 4 },
        messageKey: "configurations.messages.applied"
      }
    });
  });
});
