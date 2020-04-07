import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../../test";

import SubformLookupHeader from ".";

describe("<SubformLookupHeader /> - Form - Subforms", () => {
  const initialState = fromJS({
    forms: {
      options: {
        lookups: {
          data: [
            {
              unique_id: "lookup-location-type",
              values: [
                { id: "country", display_text: { en: "Country", es: "Pais" } },
                { id: "region", display_text: { en: "Region", es: "Region" } },
                {
                  id: "province",
                  display_text: { en: "Province", es: "Provincia" }
                }
              ]
            }
          ]
        }
      }
    }
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
