import * as constants from "./constants";

describe("ChangeLogs - Constants", () => {
  it("should have known properties", () => {
    const clonedConstants = { ...constants };

    [
      "APPROVALS",
      "CREATE_ACTION",
      "EMPTY_VALUE",
      "EXCLUDED_LOG_ACTIONS",
      "INCIDENTS",
      "NAME",
      "SUBFORM",
      "TYPE"
    ].forEach(property => {
      expect(clonedConstants).to.have.property(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).to.be.empty;
  });
});
