import namespace from "./namespace";

describe("pages/admin/<RolesForm>/ - Namespace", () => {
  it("returns the namespace", () => {
    expect(namespace).toBe("roles");
  });
});
