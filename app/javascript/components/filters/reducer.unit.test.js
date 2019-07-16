import chai, { expect } from "chai";
import { Map } from "immutable";
import chaiImmutable from "chai-immutable";
import * as r from "./reducer";

chai.use(chaiImmutable);

describe("<Filters /> - Reducers", () => {

  it("should handle SET_TAB", () => {
    const action = {
      type: "SET_TAB",
      payload: 1
    };
    const newState = r.reducers.FilterTabs(Map({}), action);
    debugger
    expect(newState.get("current")).to.deep.equal(1);
  });
});
