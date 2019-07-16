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

    expect(creators).to.have.property("setExpandedPanel");
    expect(creators).to.have.property("collapsePanels");
    expect(creators).to.have.property("resetSinglePanel");
    delete creators.setExpandedPanel;
    delete creators.collapsePanels;
    delete creators.resetSinglePanel;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'setExpandedPanel' action creator when 'expanded' is true to return the correct object", () => {
    const options = { expanded: true, panel: "my_cases", namespace: "Cases" };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    
    actionCreators.setExpandedPanel({
      expanded: true,
      panel: "my_cases",
      namespace: "Cases"
    })(dispatch);

    expect(dispatch).to.have.been.calledWithMatch({
      type: actions.SET_EXPANSION_PANEL,
      payload: options
    });
  });

  it("should check the 'setExpandedPanel' action creator when 'expanded' is false to return the correct object", () => {
    const options = { expanded: false, panel: "my_cases", namespace: "Cases" };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.setExpandedPanel({
      expanded: false,
      panel: "my_cases",
      namespace: "Cases"
    })(dispatch);

    expect(dispatch).to.have.been.calledWithMatch({
      type: actions.REMOVE_EXPANDED_PANEL,
      payload: options
    });
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

  it("should check the 'resetSinglePanel' action creator to return the correct object, when multi_toogle are reset", () => {
    const options = { id: "age_range", type: "multi_toogle" };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.resetSinglePanel({
      id: "age_range",
      type: "multi_toogle"
    }, "Cases")(dispatch);

    expect(dispatch).to.have.been.calledWithMatch({
      type: "Cases/RESET_RANGE_BUTTON",
      payload: options
    });
  });

});
