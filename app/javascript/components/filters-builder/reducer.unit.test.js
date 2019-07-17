import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";
import * as r from "./reducer";

chai.use(chaiImmutable);

describe("<FiltersBuilder /> - Reducers", () => {
  const defaultState = Map({
    Cases: [],
    Incidents: [],
    TracingRequests: []
  });

  it("should handle SET_EXPANSION_PANEL", () => {
    const action = {
      type: "SET_EXPANSION_PANEL",
      payload: {
        expanded: true,
        panel: "social_worker",
        namespace: "Cases"
      }
    };
    const newState = r.reducers.FiltersBuilder(defaultState, action);

    expect(newState.get("Cases")).to.deep.equal(["social_worker"]);
  });

  it("should handle REMOVE_EXPANDED_PANEL", () => {
    const action = {
      type: "REMOVE_EXPANDED_PANEL",
      payload: {
        expanded: false,
        panel: "social_worker",
        namespace: "Cases"
      }
    };
    const newState = r.reducers.FiltersBuilder(defaultState, action);

    expect(newState.get("Cases")).to.deep.equal([]);
  });

  it("should handle RESET_PANELS", () => {
    const action = {
      type: "REMOVE_EXPANDED_PANEL",
      payload: {
        expanded: true,
        panel: "social_worker",
        namespace: "Cases"
      }
    };
    const newState = r.reducers.FiltersBuilder(defaultState, action);

    expect(newState.get("Cases")).to.deep.equal([]);
  });
});
