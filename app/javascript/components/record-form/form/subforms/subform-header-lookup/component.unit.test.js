import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../../test";

import SubformLookupHeader from ".";

describe("<SubformLookupHeader /> - Form - Subforms", () => {
  const initialState = fromJS({
    forms: {
      options: {
        lookups: [
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
          },
          {
            unique_id: "lookup-service-type",
            values: [
              { id: "service_1", display_text: { en: "Service 1", es: "Servicio 1" } },
              { id: "service_2", display_text: { en: "Service 2", es: "Servicio 2" }, disabled: true }
            ]
          }
        ]
      }
    }
  });

  it("should render the display_text of the lookup defined on the optionsStringSource", () => {
    const props = {
      value: "region",
      optionsStringSource: "lookup lookup-location-type"
    };
    const { component } = setupMountedComponent(SubformLookupHeader, props, initialState);

    expect(component.text()).to.be.equal("Region");
  });

  it("should render the same value is this is empty", () => {
    const props = {
      value: "",
      optionsStringSource: "lookup lookup-location-type"
    };
    const { component } = setupMountedComponent(SubformLookupHeader, props, initialState);

    expect(component.text()).to.be.empty;
  });

  it("should render display_text from the values defined on the optionsStringText", () => {
    const props = {
      value: "test_2",
      optionsStringSource: "",
      optionsStringText: [
        {
          id: "test_1",
          display_text: {
            en: "Test 1",
            fr: ""
          }
        },
        {
          id: "test_2",
          display_text: {
            en: "Test 2",
            fr: ""
          }
        },
        {
          id: "test_3",
          display_text: {
            en: "Test 3",
            fr: ""
          }
        }
      ]
    };
    const { component } = setupMountedComponent(SubformLookupHeader, props, initialState);

    expect(component.text()).to.be.equal("Test 2");
  });

  it("should render the lookup even if it's disabled", () => {
    const props = {
      value: "service_2",
      optionsStringSource: "lookup lookup-service-type"
    };
    const { component } = setupMountedComponent(SubformLookupHeader, props, initialState);

    expect(component.text()).to.equal("Service 2");
  });
});
