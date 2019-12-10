import { expect } from "chai";
import { Map, fromJS } from "immutable";

import { reducers } from "./reducer";
import { SAVE_DASHBOARD_FILTERS, CLEAR_DASHBOARD_FILTERS } from "./actions";

describe("<FiltersBuilder /> - Reducers", () => {
  const namespace = "Cases";

  const defaultState = Map({
    Cases: [],
    Incidents: [],
    TracingRequests: []
  });

  it("depreacted action SET_EXPANSION_PANEL", () => {
    const action = {
      type: "SET_EXPANSION_PANEL",
      payload: {
        expanded: true,
        panel: "social_worker",
        namespace
      }
    };
    const newState = reducers(namespace)(defaultState, action);

    expect(newState.get(namespace)).to.deep.equal(defaultState.get(namespace));
  });

  it("should handle REMOVE_EXPANDED_PANEL", () => {
    const action = {
      type: "REMOVE_EXPANDED_PANEL",
      payload: {
        expanded: false,
        panel: "social_worker",
        namespace
      }
    };
    const newState = reducers(namespace)(defaultState, action);

    expect(newState.get(namespace)).to.deep.equal([]);
  });

  it("should handle RESET_PANELS", () => {
    const action = {
      type: "REMOVE_EXPANDED_PANEL",
      payload: {
        expanded: true,
        panel: "social_worker",
        namespace
      }
    };
    const newState = reducers(namespace)(defaultState, action);

    expect(newState.get(namespace)).to.deep.equal([]);
  });

  it("should handle SAVE_DASHBOARD_FILTERS", () => {
    const payload = { status: ["open"] };
    const action = {
      type: `${namespace}/${SAVE_DASHBOARD_FILTERS}`,
      payload
    };
    const newState = reducers(namespace)(defaultState, action);

    expect(newState.get("dashboardFilters")).to.deep.equal(fromJS(payload));
  });

  it("should handle CLEAR_DASHBOARD_FILTERS", () => {
    const action = {
      type: `${namespace}/${CLEAR_DASHBOARD_FILTERS}`
    };
    const newState = reducers(namespace)(defaultState, action);

    expect(newState.get("dashboardFilters")).to.be.empty;
  });
});
