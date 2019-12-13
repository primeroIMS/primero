import { expect } from "chai";
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
          "identity_providers": [
            {
              "name": "unicef",
              "type": "b2c",
              "domain_hint": "unicef",
              "authority": "authority",
              "client_id": "clientid",
              "scope": ["scope"],
              "redirect_uri": "redirect"
            },
            {
              "name": "primero",
              "type": "b2c",
              "domain_hint": "primero",
              "authority": "authority",
              "client_id": "clientid",
              "scope": ["scope"],
              "redirect_uri": "redirect"
            }
          ]
        }
      })
    ).component;
  });

  it("renders login buttons for providers", () => {
    expect(component.find(".loginSelection button.provider-login")).to.have.lengthOf(2);
  });
});
