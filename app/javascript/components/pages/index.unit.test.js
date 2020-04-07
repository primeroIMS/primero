import * as index from "./index";

describe("pages/admin - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    [
      "Admin",
      "AgenciesForm",
      "AgenciesList",
      "ContactInformation",
      "Dashboard",
      "default",
      "ExportList",
      "LookupsList",
      "NotAuthorized",
      "NotFound",
      "PotentialMatches",
      "Report",
      "Reports",
      "RolesForm",
      "RolesList",
      "Support",
      "TaskList",
      "UserGroupsForm",
      "UserGroupsList",
      "UsersForm",
      "UsersList"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
