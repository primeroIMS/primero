import clone from "lodash/clone";
import sinon from "sinon";
import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";

describe("<RecordForm /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("fetchSavedSearches");
    expect(creators).to.have.property("saveSearch");
    expect(creators).to.have.property("removeSavedSearch");
    expect(creators).to.have.property("setSavedSearch");
    delete creators.fetchSavedSearches;
    delete creators.saveSearch;
    delete creators.removeSavedSearch;
    delete creators.setSavedSearch;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'fetchSavedSearches' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.fetchSavedSearches()(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql(
      "savedSearches/FETCH_SAVED_SEARCHES"
    );
    expect(dispatch.getCall(0).returnValue.api.path).to.eql("saved_searches");
  });

  it("should check the 'setSavedSearch' action creator to return the correct object", () => {
    const options = { flagged: ["true"] };
    const dispatch = sinon.spy(actionCreators, "setSavedSearch");

    actionCreators.setSavedSearch("incidents", { flagged: ["true"] });

    expect(dispatch.getCall(0).returnValue).to.eql({
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
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.saveSearch(body, "Success Message")(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql(
      "savedSearches/SAVE_SEARCH"
    );
    expect(dispatch.getCall(0).returnValue.api.path).to.eql("saved_searches");
    expect(dispatch.getCall(0).returnValue.api.method).to.eql("POST");
    expect(dispatch.getCall(0).returnValue.api.body).to.eql(body);
    expect(dispatch.getCall(0).returnValue.api.successCallback.action).to.eql(
      "notifications/ENQUEUE_SNACKBAR"
    );
    expect(
      dispatch.getCall(0).returnValue.api.successCallback.payload.message
    ).to.eql("Success Message");
  });

  it("should check the 'removeSavedSearch' action creator to return the correct object", () => {
    const id = 1;
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.removeSavedSearch(id, "Deleted Message")(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql(
      "savedSearches/REMOVE_SAVED_SEARCH"
    );
    expect(dispatch.getCall(0).returnValue.api.path).to.eql("saved_searches/1");
    expect(dispatch.getCall(0).returnValue.api.method).to.eql("DELETE");
    expect(dispatch.getCall(0).returnValue.api.successCallback.action).to.eql(
      "notifications/ENQUEUE_SNACKBAR"
    );
    expect(
      dispatch.getCall(0).returnValue.api.successCallback.payload.message
    ).to.eql("Deleted Message");
  });
});
