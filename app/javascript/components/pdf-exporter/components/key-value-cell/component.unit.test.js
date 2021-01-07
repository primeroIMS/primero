import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";

import KeyValueCell from "./component";

describe("components/record-actions/exports/components/pdf-exporter/components/key-value-cell", () => {
  const state = fromJS({
    forms: {
      options: {
        lookups: [
          {
            unique_id: "lookup-1",
            name: { en: "Lookup 1" },
            values: [
              { id: "option-1", display_text: { en: "Option 1" } },
              { id: "option-2", display_text: { en: "Option 2" } },
              { id: "option-3", display_text: { en: "Option 3" } }
            ]
          }
        ]
      }
    }
  });

  it("renders key/value with string value", () => {
    const props = {
      displayName: "Form 1",
      value: "option-1",
      optionsStringSource: "lookup lookup-1",
      classes: {}
    };

    const { component } = setupMountedComponent(KeyValueCell, props, state);

    expect(component.find("div div").at(0).text()).to.equal("Form 1");
    expect(component.find("div div").at(1).text()).to.equal("Option 1");
  });

  it("renders key/value with array value", () => {
    const props = {
      displayName: "Form 1",
      value: fromJS(["option-1", "option-3"]),
      optionsStringSource: "lookup lookup-1",
      classes: {}
    };

    const { component } = setupMountedComponent(KeyValueCell, props, state);

    expect(component.find("div div").at(0).text()).to.equal("Form 1");
    expect(component.find("div div").at(1).text()).to.equal("Option 1, Option 3");
  });
});
