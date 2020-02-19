import { expect } from "chai";
import sinon from "sinon";
import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";

describe("<Flagging /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("fetchFlags");
    expect(creators).to.have.property("unFlag");
    expect(creators).to.have.property("addFlag");
    delete creators.fetchFlags;
    delete creators.unFlag;
    delete creators.addFlag;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'fetchFlags' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const recordType = "cases";
    const record = "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0";

    actionCreators.fetchFlags(recordType, record)(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql("flags/FETCH_FLAGS");
    expect(dispatch.getCall(0).returnValue.api.path).to.eql(
      `${recordType}/${record}/flags`
    );
  });

  it("should check the 'unFlag' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const recordType = "cases";
    const record = "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0";
    const flagId = "1";

    actionCreators.unFlag(flagId, {}, "message", recordType, record)(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql("flags/UNFLAG");
    expect(dispatch.getCall(0).returnValue.api.path).to.eql(
      `${recordType}/${record}/flags/${flagId}`
    );
  });

  it("should check the 'addFlag' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const recordType = "cases";
    const record = "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0";
    const path = `${recordType}/${record}/flags`;

    actionCreators.addFlag({}, "message", path)(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql("flags/ADD_FLAG");
    expect(dispatch.getCall(0).returnValue.api.path).to.eql(path);
  });
});
