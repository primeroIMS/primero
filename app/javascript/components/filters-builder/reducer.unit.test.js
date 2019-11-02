import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";
import * as r from "./reducer";

chai.use(chaiImmutable);

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
    const newState = r.reducers(namespace)(defaultState, action);
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
    const newState = r.reducers(namespace)(defaultState, action);

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
    const newState = r.reducers(namespace)(defaultState, action);

    expect(newState.get(namespace)).to.deep.equal([]);
  });
});
