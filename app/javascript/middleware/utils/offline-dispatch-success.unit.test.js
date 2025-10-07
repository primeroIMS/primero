// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { createMockStore } from "../../test-utils";

import offlineDispatchSuccess from "./offline-dispatch-success";
import handleRestCallback from "./handle-rest-callback";

jest.mock("./handle-rest-callback", () => ({
  __esModule: true,
  default: jest.fn()
}));

describe("middleware/utils/offline-dispatch-success.js", () => {
  const { store } = createMockStore();
  const payload = {
    data: {
      test: "payload"
    }
  };

  let dispatch;

  beforeEach(() => {
    dispatch = jest.spyOn(store, "dispatch");
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it("dispatch success and callbacks", async () => {
    offlineDispatchSuccess(store, { type: "test-action", api: { path: "/" } }, payload);

    expect(handleRestCallback).toHaveBeenCalledWith(store, undefined, null, payload, undefined);
    expect(dispatch.mock.calls[0][0]).toEqual({
      payload,
      type: "test-action_SUCCESS"
    });
    expect(dispatch.mock.calls[1][0]).toEqual({
      type: "test-action_FINISHED",
      payload: true
    });
  });
});
