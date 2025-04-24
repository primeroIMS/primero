// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<TransferRequest /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).toHaveProperty("saveTransferRequest");
    delete creators.saveTransferRequest;
    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check the 'saveTransferRequest' action creator to return the correct object", () => {
    const body = {
      data: {
        notes: "Some transfer notes"
      }
    };
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");

    dispatch(actionCreators.saveTransferRequest("123abc", body, "Success Message"));

    const firstCallReturnValue = dispatch.mock.calls[0][0];

    expect(firstCallReturnValue.type).toBe(actions.TRANSFER_REQUEST);
    expect(firstCallReturnValue.api.path).toBe(`cases/123abc/${actions.TRANSFER_REQUEST_URL}`);
    expect(firstCallReturnValue.api.method).toBe("POST");
    expect(firstCallReturnValue.api.body).toBe(body);
    expect(firstCallReturnValue.api.successCallback.action).toBe("notifications/ENQUEUE_SNACKBAR");
    expect(firstCallReturnValue.api.successCallback.payload.message).toBe("Success Message");
  });
});
