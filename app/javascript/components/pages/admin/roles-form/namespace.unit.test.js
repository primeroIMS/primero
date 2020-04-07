import { expect } from "../../../../test";

import namespace from "./namespace";

describe("pages/admin/<RolesForm>/ - Namespace", () => {
  it("returns the namespace", () => {
    expect(namespace).to.be.equal("roles");
  });
});
