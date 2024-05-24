// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { setupMountedComponent } from "../../test";

import Login from "./component";
import PrimeroIdpSelect from "./components/idp-selection/components/primero-idp-select";

describe("<Login />", () => {
  describe("for login form", () => {
    let component;

    before(() => {
      component = setupMountedComponent(
        Login,
        { isAuthenticated: false },
        fromJS({
          idp: {
            use_identity_provider: false
          },
          user: {
            module: "primero",
            agency: "unicef",
            isAuthenticated: false
          }
        })
      ).component;
    });

    it("renders form", () => {
      expect(component.find("form")).to.have.length(1);
    });
  });

  describe("for provider selection", () => {
    let component;

    before(() => {
      component = setupMountedComponent(
        Login,
        { isAuthenticated: false },
        fromJS({
          idp: {
            use_identity_provider: true,
            identity_providers: [
              {
                name: "UNICEF",
                type: "b2c",
                domain_hint: "unicef",
                authority: "authority",
                client_id: "clientid",
                scope: ["scope"],
                redirect_uri: "redirect"
              }
            ]
          }
        })
      ).component;
    });

    it("renders login selection", () => {
      expect(component.find(PrimeroIdpSelect)).to.have.lengthOf(1);
    });
  });
});
