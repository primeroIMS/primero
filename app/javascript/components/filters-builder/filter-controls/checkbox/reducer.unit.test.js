import chai, { expect } from "chai";
import { Map, List } from "immutable";
import chaiImmutable from "chai-immutable";
import * as r from "./reducer";

chai.use(chaiImmutable);
 
describe("<CheckBox /> - Reducers", () => {
  const defaultState = Map({
    my_cases: ["test"]
  });

  it("should handle RESET_CHECKBOX", () => {
    const action = {
      type: "RESET_CHECKBOX",
      payload: "my_cases"
    };
    const newState = r.checkboxReducer.CheckBox(defaultState, action);

    expect(newState.get("my_cases")).to.deep.equal(List([]));
  });
});
