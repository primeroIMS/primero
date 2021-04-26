import * as index from "./index";

describe("pages - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    [
      "Admin",
      "AgenciesForm",
      "AgenciesList",
      "AuditLogs",
      "CodeOfConduct",
      "ConfigurationsList",
      "ConfigurationsForm",
      "Dashboard",
      "ExportList",
      "FormBuilder",
      "FormsList",
      "LocationsList",
      "LookupsForm",
      "LookupsList",
      "NotAuthorized",
      "NotFound",
      "PotentialMatches",
      "RolesForm",
      "RolesList",
      "Support",
      "TaskList",
      "ContactInformation",
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
