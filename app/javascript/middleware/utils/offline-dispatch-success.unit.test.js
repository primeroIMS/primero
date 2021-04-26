import { spy, createMockStore } from "../../test";

import offlineDispatchSuccess from "./offline-dispatch-success";
import * as handleRestCallback from "./handle-rest-callback";

describe("middleware/utils/offline-dispatch-success.js", () => {
  const { store } = createMockStore();
  const payload = {
    data: {
      test: "payload"
    }
  };

  let dispatch;
  let handleRestCallbackSpy;

  beforeEach(() => {
    dispatch = spy(store, "dispatch");
    handleRestCallbackSpy = spy(handleRestCallback, "default");
  });

  afterEach(() => {
    dispatch.restore();
    handleRestCallbackSpy.restore();
  });

  it("dispatch success and callbacks", () => {
    offlineDispatchSuccess(store, { type: "test-action", api: { path: "/" } }, payload);

    expect(handleRestCallbackSpy).to.have.been.calledWith(store, undefined, null, payload, undefined);
    expect(dispatch.getCall(0).returnValue).to.deep.equal({
      payload,
      type: "test-action_SUCCESS"
    });
    expect(dispatch.getCall(1).returnValue).to.deep.equal({
      type: "test-action_FINISHED",
      payload: true
    });
  });
});
