
import { expect } from "chai";
import clone from "lodash/clone";
import * as index from "./index";

describe("<Transitions /> - index", () => {
  const indexValues = clone(index);

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    expect(indexValues).to.have.property("Transitions");
    expect(indexValues).to.have.property("fetchTransitions");
    expect(indexValues).to.have.property("selectTransitions");
    expect(indexValues).to.have.property("reducer");
    expect(indexValues).to.have.property("reducers");
    delete indexValues.Transitions;
    delete indexValues.fetchTransitions;
    delete indexValues.selectTransitions;
    delete indexValues.reducer;
    delete indexValues.reducers;
    expect(indexValues).to.deep.equal({});
  });
});
