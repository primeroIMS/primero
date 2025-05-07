// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { createMockStore } from "../../test-utils";

import handleRestCallback from "./handle-rest-callback";

describe("middleware/utils/handle-success-callback.js", () => {
  const { store } = createMockStore();
  const json = { data: { id: 1234 } };

  let dispatch;

  beforeEach(() => {
    dispatch = jest.spyOn(store, "dispatch");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("pass through no successCallback", () => {
    handleRestCallback(store, null, {}, {}, false);
    expect(dispatch).not.toHaveBeenCalled();
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

    expect(dispatch).toHaveBeenCalledWith({
      payload: { data: 1 },
      type: "test-action-1"
    });

    expect(dispatch).toHaveBeenCalledWith({
      payload: { data: 2 },
      type: "test-action-2"
    });

    expect(dispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: "test-action-3"
    });

    expect(dispatch);
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

      expect(dispatch).toHaveBeenCalledWith({
        payload: { field: "test-field" },
        type: "test-action"
      });
    });

    it("else", () => {
      const response = { field2: "test-field-2" };

      handleRestCallback(store, "test-action", response, json, false);

      expect(dispatch).toHaveBeenCalledWith({
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

      expect(dispatch).not.toHaveBeenCalled();
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

      expect(dispatch);
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

      expect(dispatch);
    });

    describe("when is incidentPath", () => {
      it("is new", () => {
        handleRestCallback(
          store,
          {
            action: "test-action",
            incidentPath: "new",
            redirect: "/record-type",
            moduleID: "primeromodule"
          },
          {},
          json,
          false
        );
        expect(dispatch);
      });

      it("is redirect to view", () => {
        handleRestCallback(
          store,
          {
            action: "test-action",
            incidentPath: "incidents/123456789",
            redirect: "/record-type",
            moduleID: "primeromodule"
          },
          {},
          json,
          false
        );
        expect(dispatch);
      });
    });
  });

  describe("when fromQueue", () => {
    it("does not handle the callback if fromQueue", () => {
      handleRestCallback(store, { action: "callback_from_queue", payload: true }, {}, {}, true);
      expect(dispatch).not.toHaveBeenCalled();
    });

    it("handles callback if performFromQueue", () => {
      const action = { action: "callback_from_queue", api: { performFromQueue: true } };
      const expected = { type: "callback_from_queue", api: { performFromQueue: true } };

      handleRestCallback(store, action, {}, {}, true);

      expect(dispatch);
    });

    it("only handles callbacks with performFromQueue in an array of callbacks", () => {
      const action = { action: "callback_from_queue", api: { performFromQueue: true } };
      const expected = { type: "callback_from_queue", api: { performFromQueue: true } };

      handleRestCallback(
        store,
        [action, { action: "callback_1", payload: true }, { action: "callback_2", payload: true }],
        {},
        {},
        true
      );

      expect(dispatch).toHaveBeenCalledWith(expected);
    });
  });
});
