// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as index from "./index";

describe("pages - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(typeof indexValues).toEqual("object");
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
      expect(indexValues).toHaveProperty(property);
      delete indexValues[property];
    });
    expect(Object.keys(indexValues)).toHaveLength(0);
  });
});
