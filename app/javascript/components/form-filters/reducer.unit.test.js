import { fromJS } from "immutable";

import reducer from "./reducer";
import * as actions from "./actions";

describe("components/drawer/reducer.js", () => {
  const defaultState = fromJS({});

  it("should handle SET_FORM_FILTERS", () => {
    const expected = fromJS({
      someForm: { filter_1: ["value_1", "value_2"] }
    });

    const action = {
      type: actions.SET_FORM_FILTERS,
      payload: { formName: "someForm", filters: { filter_1: ["value_1", "value_2"] } }
    };

    const newState = reducer.formFilters(defaultState, action);

    expect(newState).to.eql(expected);
  });

  it("should handle CLEAR_FORM_FILTERS", () => {
    const expected = fromJS({});

    const action = {
      type: actions.CLEAR_FORM_FILTERS,
      payload: "someForm"
    };

    const newState = reducer.formFilters(fromJS({ someForm: { filter_1: ["value_1", "value_2"] } }), action);

    expect(newState).to.eql(expected);
  });
});
