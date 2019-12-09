import { expect } from "chai";
import sinon from "sinon";
import configureStore from "redux-mock-store";

import { RECORD_PATH } from "../../config";

import * as actionCreators from "./action-creators";
import { SAVE_DASHBOARD_FILTERS, CLEAR_DASHBOARD_FILTERS } from "./actions";

describe("<FiltersBuilders /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    [
      "applyFilters",
      "resetSinglePanel",
      "setDashboardFilters",
      "clearDashboardFilters"
    ].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check the 'resetSinglePanel' action creator to return the correct object, when chips are reset", () => {
    const options = { id: "risk_level", type: "chips" };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.resetSinglePanel(
      {
        id: "risk_level",
        type: "chips"
      },
      "Cases"
    )(dispatch);

    expect(dispatch).to.have.been.calledWithMatch({
      type: "Cases/RESET_CHIPS",
      payload: options
    });
  });

  it("should check the 'resetSinglePanel' action creator to return the correct object, when radio are reset", () => {
    const options = { id: "sex", type: "radio" };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.resetSinglePanel(
      {
        id: "sex",
        type: "radio"
      },
      "Cases"
    )(dispatch);

    expect(dispatch).to.have.been.calledWithMatch({
      type: "Cases/RESET_RADIO_BUTTON",
      payload: options
    });
  });

  it("should check the 'resetSinglePanel' action creator to return the correct object, when multi_toggle are reset", () => {
    const options = { id: "age_range", type: "multi_toggle" };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.resetSinglePanel(
      {
        id: "age_range",
        type: "multi_toggle"
      },
      "Cases"
    )(dispatch);

    expect(dispatch).to.have.been.calledWithMatch({
      type: "Cases/RESET_RANGE_BUTTON",
      payload: options
    });
  });

  it("should check the 'setDashboardFilters' action creator to return the correct object, when chips are reset", () => {
    const recordType = RECORD_PATH.cases;
    const payload = {
      risk_level: "high"
    };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    dispatch(actionCreators.setDashboardFilters(recordType, payload));

    expect(dispatch).to.have.been.calledWithMatch({
      type: `${recordType}/${SAVE_DASHBOARD_FILTERS}`,
      payload
    });
  });

  it("should check the 'clearDashboardFilters' action creator to return the correct object, when chips are reset", () => {
    const recordType = RECORD_PATH.cases;
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    dispatch(actionCreators.clearDashboardFilters(recordType));

    expect(dispatch).to.have.been.calledWithMatch({
      type: `${recordType}/${CLEAR_DASHBOARD_FILTERS}`
    });
  });
});
