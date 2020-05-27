import { spy, createMockStore } from "../../test";

import offlineDispatchSuccess from "./offline-dispatch-success";
import * as handleRestCallback from "./handle-rest-callback";

describe("middleware/utils/offline-dispatch-success.js", () => {
  const store = createMockStore();
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
    offlineDispatchSuccess(
      store,
      { type: "test-action", api: { path: "/" } },
      payload
    );

    expect(handleRestCallbackSpy).to.have.been.calledWith(
      store,
      undefined,
      null,
      payload,
      undefined
    );
    expect(dispatch.getCall(0).returnValue).to.deep.equal({
      payload,
      type: "test-action_SUCCESS"
    });
    expect(dispatch.getCall(1).returnValue).to.deep.equal({
      type: "test-action_FINISHED",
      payload: true
    });
  });

  it("format payload based on passed key/id", () => {
    const action = {
      type: "test-action",
      api: {
        responseRecordKey: "test_prop",
        responseRecordID: 1234
      }
    };

    offlineDispatchSuccess(store, action, payload);

    expect(dispatch.getCall(0).returnValue).to.deep.equal({
      payload: {
        data: { record: { id: 1234, test_prop: { ...payload.data } } }
      },
      type: "test-action_SUCCESS"
    });
  });

  it("format payload based on passed key/id (array)", () => {
    const action = {
      type: "test-action",
      api: {
        responseRecordKey: "test_prop",
        responseRecordID: 1234,
        responseRecordArray: true
      }
    };

    offlineDispatchSuccess(store, action, payload);

    expect(dispatch.getCall(0).returnValue).to.deep.equal({
      payload: {
        data: { record: { id: 1234, test_prop: [{ ...payload.data }] } }
      },
      type: "test-action_SUCCESS"
    });
  });
});
