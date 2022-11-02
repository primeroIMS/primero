import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../../test";
import Form, { FormAction } from "../../../../form";

import PrimeroIdpSelect from "./primero-idp-select";

describe("<PrimeroIdpSelect />", () => {
  let component;
  const props = {
    identityProviders: fromJS([
      {
        unique_id: "primeroims",
        name: "Primero"
      }
    ]),
    css: {}
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(PrimeroIdpSelect, props));
  });

  it("renders forms components", () => {
    expect(component.find(PrimeroIdpSelect)).to.have.lengthOf(1);
    expect(component.find(Form)).to.have.lengthOf(1);
    expect(component.find(FormAction)).to.have.lengthOf(1);
  });
});
