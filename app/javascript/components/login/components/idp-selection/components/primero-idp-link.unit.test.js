// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { Link } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../test";

import PrimeroIdpLink from "./primero-idp-link";

describe("<PrimeroIdpLink />", () => {
  let component;
  const props = {
    identityProviders: fromJS([
      {
        unique_id: "primeroims",
        name: "Primero"
      },
      {
        unique_id: "randomidp",
        name: "RandomIDP"
      }
    ]),
    css: {},
    dispatch: () => {},
    i18n: {
      t: () => {}
    }
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(PrimeroIdpLink, props));
  });

  it("renders forms components", () => {
    expect(component.find("span")).to.have.lengthOf(1);
    expect(component.find(PrimeroIdpLink)).to.have.lengthOf(1);
    expect(component.find(Link)).to.have.lengthOf(1);
  });

  context("when primeroims is the only one", () => {
    const propsOnlyPrimeroIDP = {
      identityProviders: fromJS([
        {
          unique_id: "primeroims",
          name: "Primero"
        }
      ]),
      css: {},
      dispatch: () => {},
      i18n: {
        t: () => {}
      }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(PrimeroIdpLink, propsOnlyPrimeroIDP));
    });

    it("renders forms components", () => {
      expect(component.find("span")).to.have.lengthOf(0);
      expect(component.find(PrimeroIdpLink)).to.have.lengthOf(1);
      expect(component.find(Link)).to.have.lengthOf(1);
    });
  });

  context("when there is only one IDP but not primeroims", () => {
    const propsOnlyPrimeroIDP = {
      identityProviders: fromJS([
        {
          unique_id: "randomidp",
          name: "RandomIDP"
        }
      ]),
      css: {},
      dispatch: () => {},
      i18n: {
        t: () => {}
      }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(PrimeroIdpLink, propsOnlyPrimeroIDP));
    });

    it("renders forms components", () => {
      expect(component.find("span")).to.have.lengthOf(0);
      expect(component.find(Link)).to.have.lengthOf(0);
    });
  });
});
