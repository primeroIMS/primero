import { expect } from "chai";
import { Map, List } from "immutable";

import { setupMountedComponent } from "../../../../test";

import SubformLookupHeader from "./subform-header-lookup";

describe("<SubformLookupHeader /> - Form - Subforms", () => {
  // TODO: initialState should only use fromJS() until options of forms have
  // been changed to use Immutable objects
  const initialState = Map({
    forms: Map({
      options: List([
        {
          type: "lookup-location-type",
          options: [
            { id: "country", display_text: "Country" },
            { id: "region", display_text: "Region" },
            { id: "province", display_text: "Province" }
          ]
        }
      ])
    })
  });

  it("should render the display_text of the lookup defined on the optionsStringSource", () => {
    const props = {
      value: "region",
      optionsStringSource: "lookup lookup-location-type"
    };
    const { component } = setupMountedComponent(
      SubformLookupHeader,
      props,
      initialState
    );

    expect(component.text()).to.be.equal("Region");
  });

  it("should render the same value is this is empty", () => {
    const props = {
      value: "",
      optionsStringSource: "lookup lookup-location-type"
    };
    const { component } = setupMountedComponent(
      SubformLookupHeader,
      props,
      initialState
    );

    expect(component.text()).to.be.empty;
  });
});
