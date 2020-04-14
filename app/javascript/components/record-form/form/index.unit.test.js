import * as constants from "./index";

describe("<Form /> - index", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    ["RecordForm", "RecordFormToolbar", "FormSectionField"].forEach(
      property => {
        expect(clone).to.have.property(property);
        delete clone[property];
      }
    );
    expect(clone).to.be.empty;
  });
});
