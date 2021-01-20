import * as constants from "./constants";

describe("ChangeLogs - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    ["NAME", "APPROVALS", "SUBFORM", "CREATE_ACTION", "EMPTY_VALUE", "TYPE", "EXCLUDED_LOG_ACTIONS"].forEach(
      property => {
        expect(clonedConstants).to.have.property(property);
        delete clonedConstants[property];
      }
    );

    expect(clonedConstants).to.be.empty;
  });
});
