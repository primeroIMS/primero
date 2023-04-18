import { spy, createMockStore } from "../../test";

import redirectTo from "./redirect-to";

describe("middleware/utils/redirect-to.js", () => {
  const { store } = createMockStore();
  let dispatch;

  beforeEach(() => {
    dispatch = spy(store, "dispatch");
  });

  afterEach(() => {
    dispatch.restore();
  });

  it("returns online value from redux state", () => {
    redirectTo(store, "/test");

    expect(dispatch.getCall(0)).to.have.been.calledWith({
      payload: { args: ["/test"], method: "push" },
      type: "@@router/CALL_HISTORY_METHOD"
    });
  });
});
