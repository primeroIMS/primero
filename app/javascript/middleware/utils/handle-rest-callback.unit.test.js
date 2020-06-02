import { spy, createMockStore, stub } from "../../test";

import handleRestCallback from "./handle-rest-callback";

describe("middleware/utils/handle-success-callback.js", () => {
  const store = createMockStore();
  const json = { data: { id: 1234 } };
  const pushAction = path => ({
    payload: { args: [path], method: "push" },
    type: "@@router/CALL_HISTORY_METHOD"
  });

  let dispatch;
  let pushState;

  beforeEach(() => {
    dispatch = spy(store, "dispatch");
    pushState = stub(global.history, "pushState");
  });

  afterEach(() => {
    dispatch.restore();
    pushState.restore();
  });

  it("pass through no successCallback", () => {
    handleRestCallback(store, null, {}, {}, false);
    expect(dispatch).to.not.have.been.called;
  });

  it("handles successCallback as array", () => {
    handleRestCallback(
      store,
      [
        {
          action: "test-action-1",
          payload: { data: 1 }
        },
        {
          action: "test-action-2",
          payload: { data: 2 }
        },
        {
          action: "test-action-3",
          redirectWithIdFromResponse: true,
          redirect: "/record-type"
        }
      ],
      { response: "test" },
      json,
      false
    );

    expect(dispatch.getCall(0)).to.have.been.calledWith({
      payload: { data: 1 },
      type: "test-action-1"
    });

    expect(dispatch.getCall(1)).to.have.been.calledWith({
      payload: { data: 2 },
      type: "test-action-2"
    });

    expect(dispatch.getCall(2)).to.have.been.calledWith({
      payload: undefined,
      type: "test-action-3"
    });

    expect(dispatch.getCall(3)).to.have.been.calledWith(
      pushAction("/record-type/1234")
    );
  });

  describe("success payload", () => {
    it("successCallback === 'object'", () => {
      handleRestCallback(
        store,
        {
          action: "test-action",
          payload: { field: "test-field" }
        },
        {},
        json,
        false
      );

      expect(dispatch.getCall(0)).to.have.been.calledWith({
        payload: { field: "test-field" },
        type: "test-action"
      });
    });

    it("else", () => {
      const response = { field2: "test-field-2" };

      handleRestCallback(store, "test-action", response, json, false);

      expect(dispatch.getCall(0)).to.have.been.calledWith({
        payload: { response, json },
        type: "test-action"
      });
    });
  });

  describe("redirects", () => {
    it("pass through if from queue", () => {
      handleRestCallback(
        store,
        {
          action: "test-action",
          redirectWithIdFromResponse: true,
          redirect: "/record-type"
        },
        {},
        json,
        true
      );

      expect(dispatch).to.have.been.calledOnce;
    });

    it("from response id", () => {
      handleRestCallback(
        store,
        {
          action: "test-action",
          redirectWithIdFromResponse: true,
          redirect: "/record-type"
        },
        {},
        json,
        false
      );

      expect(dispatch.getCall(1)).to.have.been.calledWith(
        pushAction("/record-type/1234")
      );
    });

    it("to edit", () => {
      handleRestCallback(
        store,
        {
          action: "test-action",
          redirectToEdit: true,
          redirect: "/record-type"
        },
        {},
        json,
        false
      );

      expect(dispatch.getCall(1)).to.have.been.calledWith(
        pushAction("/record-type/1234/edit")
      );
    });
  });
});
