import * as index from "./index";

describe("pages/admin/<RolesForm>/forms - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    [
      "ActionButtons",
      "AssociatedFormSectionsForm",
      "AssociatedRolesForm",
      "ResourcesForm",
      "RolesMainForm",
      "Validations"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
