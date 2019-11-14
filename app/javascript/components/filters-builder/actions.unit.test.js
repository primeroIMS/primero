import { expect } from "chai";

import * as filtersBuilderActions from "./actions";

describe("filters-builder - Actions", () => {
  it("should have known actions", () => {
    const actions = { ...filtersBuilderActions };

    expect(actions, "DEPRECATED").to.not.have.property("SET_EXPANSION_PANEL");
    expect(actions).to.have.property("REMOVE_EXPANDED_PANEL");
    expect(actions).to.have.property("RESET_PANELS");
    expect(actions).to.have.property("CASES_SET_FILTERS");
    expect(actions).to.have.property("INCIDENTS_SET_FILTERS");
    expect(actions).to.have.property("TRACING_REQUESTS_SET_FILTERS");
    expect(actions).to.have.property("SET_FILTERS");
    expect(actions).to.have.property("ADD_CHECKBOX");
    expect(actions).to.have.property("DELETE_CHECKBOX");
    expect(actions).to.have.property("ADD_SELECT");
    expect(actions).to.have.property("ADD_RADIO_BUTTON");
    expect(actions).to.have.property("ADD_RANGE_BUTTON");
    expect(actions).to.have.property("ADD_CHIP");
    expect(actions).to.have.property("DELETE_CHIP");
    expect(actions).to.have.property("SET_RECORD_SEARCH");
    expect(actions).to.have.property("ADD_DATES_RANGE");
    expect(actions).to.have.property("ADD_SELECT_RANGE");
    expect(actions).to.have.property("ADD_SWITCH_BUTTON");
    expect(actions).to.have.property("DELETE_SWITCH_BUTTON");
    expect(actions).to.have.property("RESET_CHIPS");
    expect(actions).to.have.property("RESET_RADIO_BUTTON");
    expect(actions).to.have.property("RESET_RANGE_BUTTON");
    expect(actions).to.have.property("SET_SAVED_FILTERS");
    expect(actions).to.have.property("CLEAR_FILTERS");

    delete actions.REMOVE_EXPANDED_PANEL;
    delete actions.RESET_PANELS;
    delete actions.CASES_SET_FILTERS;
    delete actions.INCIDENTS_SET_FILTERS;
    delete actions.TRACING_REQUESTS_SET_FILTERS;
    delete actions.SET_FILTERS;
    delete actions.ADD_CHECKBOX;
    delete actions.DELETE_CHECKBOX;
    delete actions.ADD_SELECT;
    delete actions.ADD_RADIO_BUTTON;
    delete actions.ADD_RANGE_BUTTON;
    delete actions.ADD_CHIP;
    delete actions.DELETE_CHIP;
    delete actions.SET_RECORD_SEARCH;
    delete actions.ADD_DATES_RANGE;
    delete actions.ADD_SELECT_RANGE;
    delete actions.ADD_SWITCH_BUTTON;
    delete actions.DELETE_SWITCH_BUTTON;
    delete actions.RESET_CHIPS;
    delete actions.RESET_RADIO_BUTTON;
    delete actions.RESET_RANGE_BUTTON;
    delete actions.SET_SAVED_FILTERS;
    delete actions.CLEAR_FILTERS;

    expect(actions).to.deep.equal({});
  });
});
