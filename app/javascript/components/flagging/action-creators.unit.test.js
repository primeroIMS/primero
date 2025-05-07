// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";

describe("<Flagging /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).toHaveProperty("fetchFlags");
    expect(creators).toHaveProperty("unFlag");
    expect(creators).toHaveProperty("addFlag");
    expect(creators).toHaveProperty("setSelectedFlag");
    delete creators.fetchFlags;
    delete creators.unFlag;
    delete creators.addFlag;
    delete creators.setSelectedFlag;

    expect(creators).toEqual({});
  });

  it("should check the 'fetchFlags' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");
    const recordType = "cases";
    const record = "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0";

    actionCreators.fetchFlags(recordType, record)(dispatch);

    expect(dispatch.mock.calls[0][0].type).toEqual("flags/FETCH_FLAGS");
    expect(dispatch.mock.calls[0][0].api.path).toEqual(`${recordType}/${record}/flags`);
  });

  it("should check the 'unFlag' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");
    const recordType = "cases";
    const record = "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0";
    const flagId = "1";

    dispatch(actionCreators.unFlag(flagId, {}, "message", recordType, record));

    expect(dispatch.mock.calls[0][0].type).toEqual("flags/UNFLAG");
    expect(dispatch.mock.calls[0][0].api.path).toEqual(`${recordType}/${record}/flags/${flagId}`);
  });

  it("should check the 'addFlag' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");
    const recordType = "cases";
    const record = "d6a6dbb4-e5e9-4720-a661-e181a12fd3a0";
    const path = `${recordType}/${record}/flags`;

    actionCreators.addFlag({}, "message", path)(dispatch);

    expect(dispatch.mock.calls[0][0].type).toEqual("flags/ADD_FLAG");
    expect(dispatch.mock.calls[0][0].api.path).toEqual(path);
  });

  it("should check the 'setSelectedFlag' action creator to return the correct object", () => {
    const id = "123";
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");

    dispatch(actionCreators.setSelectedFlag(id));

    expect(dispatch.mock.calls[0][0]).toEqual({
      type: "flags/SET_SELECTED_FLAG",
      payload: { id }
    });
  });
});
