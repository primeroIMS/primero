
import { expect } from "chai";
import clone from "lodash/clone";
import * as index from "./index";

describe("<TransferForm /> - index", () => {
  const indexValues = clone(index);
  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    expect(indexValues).to.have.property("TransferForm");
    delete indexValues.TransferForm;
    expect(indexValues).to.deep.equal({});
  });
});
