import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import * as actionCreators from "./action-creators";
import * as actions from "./actions";

chai.use(sinonChai);

describe("<FiltersBuilders /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("collapsePanels");
    expect(creators).to.have.property("applyFilters");
    expect(creators).to.have.property("resetSinglePanel");
    delete creators.collapsePanels;
    delete creators.applyFilters;
    delete creators.resetSinglePanel;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'collapsePanels' action creator to return the correct object", () => {
    const dispatch = sinon.spy(actionCreators, "collapsePanels");

    actionCreators.collapsePanels();

    expect(dispatch.getCall(0).returnValue).to.eql({ type: "RESET_PANELS" });
  });

  it("should check the 'resetSinglePanel' action creator to return the correct object, when chips are reset", () => {
    const options = { id: "risk_level", type: "chips" };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.resetSinglePanel({
      id: "risk_level",
      type: "chips"
    }, "Cases")(dispatch);

    expect(dispatch).to.have.been.calledWithMatch({
      type: "Cases/RESET_CHIPS",
      payload: options
    });
  });

  it("should check the 'resetSinglePanel' action creator to return the correct object, when radio are reset", () => {
    const options = { id: "sex", type: "radio" };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.resetSinglePanel({
      id: "sex",
      type: "radio"
    }, "Cases")(dispatch);

    expect(dispatch).to.have.been.calledWithMatch({
      type: "Cases/RESET_RADIO_BUTTON",
      payload: options
    });
  });

  it("should check the 'resetSinglePanel' action creator to return the correct object, when multi_toggle are reset", () => {
    const options = { id: "age_range", type: "multi_toggle" };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.resetSinglePanel({
      id: "age_range",
      type: "multi_toggle"
    }, "Cases")(dispatch);

    expect(dispatch).to.have.been.calledWithMatch({
      type: "Cases/RESET_RANGE_BUTTON",
      payload: options
    });
  });

});
