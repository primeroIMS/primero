import { expect } from "chai";

import * as filtersBuilderActions from "./actions";

describe("filters-builder - Actions", () => {
  it("should have known actions", () => {
    const actions = { ...filtersBuilderActions };

    expect(actions, "DEPRECATED").to.not.have.property("SET_EXPANSION_PANEL");

    [
      "REMOVE_EXPANDED_PANEL",
      "RESET_PANELS",
      "CASES_SET_FILTERS",
      "INCIDENTS_SET_FILTERS",
      "TRACING_REQUESTS_SET_FILTERS",
      "SET_FILTERS",
      "ADD_CHECKBOX",
      "DELETE_CHECKBOX",
      "ADD_SELECT",
      "ADD_RADIO_BUTTON",
      "ADD_RANGE_BUTTON",
      "ADD_CHIP",
      "DELETE_CHIP",
      "SET_RECORD_SEARCH",
      "ADD_DATES_RANGE",
      "ADD_SELECT_RANGE",
      "ADD_SWITCH_BUTTON",
      "DELETE_SWITCH_BUTTON",
      "RESET_CHIPS",
      "RESET_RADIO_BUTTON",
      "RESET_RANGE_BUTTON",
      "SET_SAVED_FILTERS",
      "CLEAR_FILTERS",
      "SAVE_DASHBOARD_FILTERS",
      "CLEAR_DASHBOARD_FILTERS"
    ].forEach(property => {
      expect(actions).to.have.property(property);
      delete actions[property];
    });

    expect(actions).to.be.empty;
  });
});
