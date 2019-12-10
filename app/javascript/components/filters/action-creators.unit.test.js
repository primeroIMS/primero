import configureStore from "redux-mock-store";
import { expect } from "chai";
import sinon from "sinon";
import { fromJS } from "immutable";

import { RECORD_PATH } from "../../config";

import * as actionCreators from "./action-creators";

describe("<Filters /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("setTab");
    expect(creators).to.have.property("setInitialFilterValues");
    expect(creators).to.have.property("setInitialRecords");
    delete creators.setTab;
    delete creators.setInitialFilterValues;
    delete creators.setInitialRecords;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'setTab' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    dispatch({
      payload: 1,
      type: "SET_TAB"
    });

    const actionCreator = actionCreators.setTab(1);

    expect(dispatch).to.have.been.calledWithMatch(actionCreator);
  });

  it("should run 'setInitialRecords' action creator", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    dispatch({
      type: "cases/RECORDS",
      api: {
        path: "/cases",
        params: {}
      }
    });
    const actionCreator = actionCreators.setInitialRecords(
      "/cases",
      "cases",
      {}
    );

    expect(dispatch).to.have.been.calledWithMatch(actionCreator);
  });

  it("should check the 'setInitialFilterValues' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    const payload = {
      workflow: fromJS([])
    };

    const fromDashboard = {
      workflow: ["service_provision"]
    };

    dispatch(
      actionCreators.setInitialFilterValues(
        RECORD_PATH.cases,
        payload,
        fromDashboard
      )
    );

    const firstCallReturnValue = dispatch.getCall(0).returnValue;

    expect(firstCallReturnValue.type).to.equal("cases/CLEAR_FILTERS");
    expect(firstCallReturnValue.payload).to.deep.equal(fromDashboard);
  });
});
