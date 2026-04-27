import * as constants from "./constants";

describe("<RolesList /> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    ["ADMIN_NAMESPACE", "LIST_HEADERS", "NAME"].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
