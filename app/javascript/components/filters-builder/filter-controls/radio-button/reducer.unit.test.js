import { expect } from "chai";
import { Map } from "immutable";

import { radioButtonsReducer } from "./reducer";

describe("<CheckBox /> - Reducers", () => {
  const defaultState = Map({
    age: "male"
  });

  it("should handle RESET_RADIO_BUTTON", () => {
    const action = {
      type: "RESET_RADIO_BUTTON",
      payload: "age"
    };
    const newState = radioButtonsReducer.RadioButton(defaultState, action);

    expect(newState.get("age")).to.deep.equal("");
  });
});
