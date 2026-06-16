import { fromJS } from "immutable";

import { APPLICATION_NAV } from "./config";

const settingsNav = nav => nav.find(item => item.name === "navigation.settings");

describe("APPLICATION_NAV/settings redirect", () => {
  it("should redirect to the first accessible resource when user has read permission", () => {
    const permissions = fromJS({ users: ["read"] });

    expect(settingsNav(APPLICATION_NAV(permissions, "1")).to).toBe("/admin/users");
  });

  it("should redirect to forms when user only has manage_restricted on metadata", () => {
    const permissions = fromJS({ metadata: ["manage_restricted"] });

    expect(settingsNav(APPLICATION_NAV(permissions, "1")).to).toBe("/admin/forms");
  });

  it("should redirect to audit_logs when that is the only accessible resource", () => {
    const permissions = fromJS({ audit_logs: ["read"] });

    expect(settingsNav(APPLICATION_NAV(permissions, "1")).to).toBe("/admin/audit_logs");
  });

  it("should fallback to contact_information when user has no admin permissions", () => {
    const permissions = fromJS({ cases: ["manage"] });

    expect(settingsNav(APPLICATION_NAV(permissions, "1")).to).toBe("/admin/contact_information");
  });

  it("should respect ADMIN_NAV order and redirect to the first accessible resource", () => {
    const permissions = fromJS({
      metadata: ["manage_restricted"],
      users: ["read"]
    });

    expect(settingsNav(APPLICATION_NAV(permissions, "1")).to).toBe("/admin/users");
  });
});
