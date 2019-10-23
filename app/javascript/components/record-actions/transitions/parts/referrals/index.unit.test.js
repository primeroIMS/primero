import "test/test.setup";
import { expect } from "chai";
import * as index from "./index";

describe("<ReferralForm /> - index", () => {
  const indexValues = { ...index };
  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    expect(indexValues).to.have.property("ReferralForm");
    delete indexValues.ReferralForm;
    expect(indexValues).to.deep.equal({});
  });
});
