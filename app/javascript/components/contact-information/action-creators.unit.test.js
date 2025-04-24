// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";

describe("<Support /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).toHaveProperty("fetchContactInformation");
    delete creators.fetchContactInformation;

    expect(creators).toEqual({});
  });

  it("should check the 'fetchData' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");

    dispatch(actionCreators.fetchContactInformation());
    expect(dispatch).toHaveBeenCalledWith({
      api: { db: { collection: "contact_information" }, path: "contact_information" },
      type: "support/FETCH_DATA"
    });
  });
});
