import * as constants from "./constants";

describe("<FormList /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    ["DRAGGING_COLOR", "DRAGGING_IDLE_COLOR"].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });
});
