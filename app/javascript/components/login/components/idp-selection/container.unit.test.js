import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";

import LoginSelection from "./container";

describe("<LoginSelection />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      LoginSelection,
      { isAuthenticated: false },
      fromJS({
        idp: {
          use_identity_provider: true,
          identity_providers: [
            {
              name: "unicef",
              provider_type: "b2c",
              unique_id: "unicef",
              authorization_url: "authority",
              client_id: "clientid",
              identity_scope: ["scope"],
              domain_hint: "unicef"
            },
            {
              name: "primero",
              provider_type: "b2c",
              unique_id: "primeroims",
              authorization_url: "authority",
              client_id: "clientid",
              identity_scope: ["scope"],
              domain_hint: "primero"
            }
          ]
        }
      })
    ).component;
  });

  it("renders login buttons for providers", () => {
    expect(component.find("button")).to.have.lengthOf(1);
  });

  it("renders a link for primeroims provider", () => {
    expect(component.find("a")).to.have.lengthOf(1);
  });
});
