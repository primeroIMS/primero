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
              identity_scope: ["scope"]
            },
            {
              name: "primero",
              provider_type: "b2c",
              unique_id: "primero",
              authorization_url: "authority",
              client_id: "clientid",
              identity_scope: ["scope"]
            }
          ]
        }
      })
    ).component;
  });

  it("renders login buttons for providers", () => {
    expect(
      component.find(".loginSelection button.provider-login")
    ).to.have.lengthOf(2);
  });
});
