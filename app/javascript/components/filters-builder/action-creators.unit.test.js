import { expect } from "chai";
import sinon from "sinon";
import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";

describe("<FiltersBuilders /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("applyFilters");
    expect(creators).to.have.property("resetSinglePanel");
    delete creators.applyFilters;
    delete creators.resetSinglePanel;

    expect(creators).to.deep.equal({});
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
});
