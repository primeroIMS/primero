import { expect } from "../../../test";

import * as index from "./index";

describe("pages/admin - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    [
      "Admin",
      "UsersForm",
      "UsersList",
      "UserGroupsForm",
      "UserGroupsList",
      "AgenciesList",
      "AgenciesForm",
      "RolesForm",
      "LookupsList",
      "RolesList",
      "ContactInformation"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });
    expect(indexValues).to.be.empty;
  });
});
