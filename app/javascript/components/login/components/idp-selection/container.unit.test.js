// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { Link } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";
import SelectInput from "../../../form/fields/select-input";
import { PageHeading } from "../../../page";
import Form from "../../../form";

import LoginSelection from "./container";
import PrimeroIdpSelect from "./components/primero-idp-select";

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

  it("renders login PrimeroIdpSelect for providers", () => {
    expect(component.find(PrimeroIdpSelect)).to.have.lengthOf(1);
    expect(component.find(SelectInput)).to.have.lengthOf(1);
  });

  it("renders a link for primeroims provider", () => {
    expect(component.find("a")).to.have.lengthOf(1);
  });

  context("when primeroims is the only one", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        LoginSelection,
        {},
        fromJS({
          idp: {
            use_identity_provider: true,
            identity_providers: [
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
      ));
    });

    it("renders forms components", () => {
      expect(component.find(PageHeading)).to.have.lengthOf(1);
      expect(component.find(Form)).to.have.lengthOf(0);
      expect(component.find("span")).to.have.lengthOf(0);
      expect(component.find(Link)).to.have.lengthOf(1);
    });
  });
});
