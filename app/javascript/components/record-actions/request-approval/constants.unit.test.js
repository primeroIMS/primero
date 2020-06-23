import * as constants from "./constants";

describe("RequestApproval /> - components/record-actions/request-approval", () => {
  it("should have known constant", () => {
    const constantsValues = { ...constants };

    ["APPROVAL_FORM", "APPROVAL_TYPE_LOOKUP", "CASE_PLAN", "NAME"].forEach(
      property => {
        expect(constantsValues).to.have.property(property);

        delete constantsValues[property];
      }
    );

    expect(constantsValues).to.be.empty;
  });
});
