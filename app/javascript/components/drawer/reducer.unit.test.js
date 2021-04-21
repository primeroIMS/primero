import { fromJS } from "immutable";

import reducer from "./reducer";
import * as actions from "./actions";

describe("components/drawer/reducer.js", () => {
  const defaultState = fromJS({});

  it("should handle SET_DRAWER", () => {
    const expected = fromJS({
      formDrawer: true
    });

    const action = {
      type: actions.SET_DRAWER,
      payload: { name: "formDrawer", open: true }
    };

    const newState = reducer.drawers(defaultState, action);

    expect(newState).to.eql(expected);
  });

  it("should handle TOGGLE_DRAWER", () => {
    const expected = fromJS({
      formDrawer: false
    });

    const action = {
      type: actions.TOGGLE_DRAWER,
      payload: "formDrawer"
    };

    const newState = reducer.drawers(fromJS({ formDrawer: true }), action);

    expect(newState).to.eql(expected);
  });
});
