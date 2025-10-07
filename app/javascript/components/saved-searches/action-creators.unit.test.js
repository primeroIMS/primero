// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";
import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";

describe("<RecordForm /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).toHaveProperty("fetchSavedSearches");
    expect(creators).toHaveProperty("saveSearch");
    expect(creators).toHaveProperty("removeSavedSearch");
    expect(creators).toHaveProperty("setSavedSearch");
    delete creators.fetchSavedSearches;
    delete creators.saveSearch;
    delete creators.removeSavedSearch;
    delete creators.setSavedSearch;

    expect(creators).toEqual({});
  });

  it("should check the 'fetchSavedSearches' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");

    actionCreators.fetchSavedSearches()(dispatch);

    expect(dispatch.mock.calls[0][0].type).toEqual("savedSearches/FETCH_SAVED_SEARCHES");
    expect(dispatch.mock.calls[0][0].api.path).toEqual("saved_searches");
  });

  it("should check the 'setSavedSearch' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");
    const options = { flagged: ["true"] };

    dispatch(actionCreators.setSavedSearch("incidents", { flagged: ["true"] }));

    expect(dispatch.mock.calls[0][0]).toEqual({
      type: "incidents/SET_SAVED_FILTERS",
      payload: options
    });
  });

  it("should check the 'saveSearch' action creator to return the correct object", () => {
    const body = {
      data: {
        name: "a new filter",
        record_type: "case",
        module_ids: ["primeromodule-cp", "primeromodule-gbv"],
        filters: [
          {
            name: "flag",
            value: ["true", "false"]
          }
        ]
      }
    };
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");

    actionCreators.saveSearch(body, "Success Message")(dispatch);

    expect(dispatch.mock.calls[0][0].type).toEqual("savedSearches/SAVE_SEARCH");
    expect(dispatch.mock.calls[0][0].api.path).toEqual("saved_searches");
    expect(dispatch.mock.calls[0][0].api.method).toEqual("POST");
    expect(dispatch.mock.calls[0][0].api.body).toEqual(body);
    expect(dispatch.mock.calls[0][0].api.successCallback.action).toEqual("notifications/ENQUEUE_SNACKBAR");
    expect(dispatch.mock.calls[0][0].api.successCallback.payload.message).toEqual("Success Message");
  });

  it("should check the 'removeSavedSearch' action creator to return the correct object", () => {
    const id = 1;
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");

    actionCreators.removeSavedSearch(id, "Deleted Message")(dispatch);

    expect(dispatch.mock.calls[0][0].type).toEqual("savedSearches/REMOVE_SAVED_SEARCH");
    expect(dispatch.mock.calls[0][0].api.path).toEqual("saved_searches/1");
    expect(dispatch.mock.calls[0][0].api.method).toEqual("DELETE");
    expect(dispatch.mock.calls[0][0].api.successCallback.action).toEqual("notifications/ENQUEUE_SNACKBAR");
    expect(dispatch.mock.calls[0][0].api.successCallback.payload.message).toEqual("Deleted Message");
  });
});
