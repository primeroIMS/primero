// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import namespace from "./namespace";

describe("pages/admin/<RolesForm>/ - Namespace", () => {
  it("returns the namespace", () => {
    expect(namespace).toBe("roles");
  });
});
