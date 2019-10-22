import "test/test.setup";
import { expect } from "chai";
import * as index from "./index";

describe("<Transitions /> - parts/index", () => {
  const indexValues = { ...index };
  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    expect(indexValues).to.have.property("TransferForm");
    expect(indexValues).to.have.property("TransitionDialog");
    expect(indexValues).to.have.property("ReferralForm");
    expect(indexValues).to.have.property("ReassignForm");
    delete indexValues.TransferForm;
    delete indexValues.TransitionDialog;
    delete indexValues.ReferralForm;
    delete indexValues.ReassignForm;
    expect(indexValues).to.deep.equal({});
  });
});
