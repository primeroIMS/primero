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

  it("should render display_text from the values defined on the optionsStringText", () => {
    const props = {
      value: "test_2",
      optionsStringSource: "",
      optionsStringText: {
        en: [
          {
            id: "test_1",
            display_text: "Test 1"
          },
          {
            id: "test_2",
            display_text: "Test 2"
          },
          {
            id: "test_3",
            display_text: "Test 3"
          }
        ],
        fr: []
      }
    };
    const { component } = setupMountedComponent(
      SubformLookupHeader,
      props,
      initialState
    );

    expect(component.text()).to.be.equal("Test 2");
  });
});
