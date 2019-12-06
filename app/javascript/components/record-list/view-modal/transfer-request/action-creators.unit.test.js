import { expect } from "chai";
import sinon from "sinon";
import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<TransferRequest /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("saveTransferRequest");
    delete creators.saveTransferRequest;
    expect(creators).to.be.empty;
  });

  it("should check the 'saveTransferRequest' action creator to return the correct object", () => {
    const body = {
      data: {
        notes: "Some transfer notes"
      }
    };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    dispatch(
      actionCreators.saveTransferRequest("123abc", body, "Success Message")
    );

    const firstCallReturnValue = dispatch.getCall(0).returnValue;

    expect(firstCallReturnValue.type).to.equal(actions.TRANSFER_REQUEST);
    expect(firstCallReturnValue.api.path).to.equal(
      `cases/123abc/${actions.TRANSFER_REQUEST_URL}`
    );
    expect(firstCallReturnValue.api.method).to.equal("POST");
    expect(firstCallReturnValue.api.body).to.equal(body);
    expect(firstCallReturnValue.api.successCallback.action).to.equal(
      "notifications/ENQUEUE_SNACKBAR"
    );
    expect(firstCallReturnValue.api.successCallback.payload.message).to.equal(
      "Success Message"
    );
  });
});
