import * as index from "./index";

describe("<DraggableRow /> - components/draggable-row/index", () => {
  const clone = { ...index };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    ["default"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
