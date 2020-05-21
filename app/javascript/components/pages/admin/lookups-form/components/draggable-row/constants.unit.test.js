import * as constants from "./constants";

describe("<DraggableRow /> - components/draggable-row/constants", () => {
  it("should have known properties", () => {
    const clone = { ...constants };

    ["NAME"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
