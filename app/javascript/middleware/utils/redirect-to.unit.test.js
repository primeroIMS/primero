// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { createMockStore } from "../../test-utils";

import redirectTo from "./redirect-to";

describe("middleware/utils/redirect-to.js", () => {
  const { store } = createMockStore();
  let dispatch;

  beforeEach(() => {
    dispatch = jest.spyOn(store, "dispatch");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns online value from redux state", () => {
    redirectTo(store, "/test");

    expect(dispatch).toHaveBeenCalledWith({
      payload: { args: ["/test"], method: "push" },
      type: "@@router/CALL_HISTORY_METHOD"
    });
  });
});
