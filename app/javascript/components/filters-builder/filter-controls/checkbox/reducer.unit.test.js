import { expect } from "chai";
import { Map, List } from "immutable";

import { checkboxReducer } from "./reducer";

 
describe("<CheckBox /> - Reducers", () => {
  const defaultState = Map({
    my_cases: ["test"]
  });

  it("should handle RESET_CHECKBOX", () => {
    const action = {
      type: "RESET_CHECKBOX",
      payload: "my_cases"
    };
    const newState = checkboxReducer.CheckBox(defaultState, action);

    expect(newState.get("my_cases")).to.deep.equal(List([]));
  });
});
