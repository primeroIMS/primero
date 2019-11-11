import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";
import * as r from "./reducer";

chai.use(chaiImmutable);

describe("<CheckBox /> - Reducers", () => {
  const defaultState = Map({
    age: "male"
  });

  it("should handle RESET_RADIO_BUTTON", () => {
    const action = {
      type: "RESET_RADIO_BUTTON",
      payload: "age"
    };
    const newState = r.radioButtonsReducer.RadioButton(defaultState, action);

    expect(newState.get("age")).to.deep.equal("");
  });
});
