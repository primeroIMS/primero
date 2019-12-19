import { setupMockFormComponent, expect } from "../../../../test";

import CheckboxFilter from "./checkbox-filter";

describe("<CheckboxFilter>", () => {
  const props = {
    filter: {
      field_name: "filter",
      name: "Filter 1",
      options: [
        { id: "option-1", display_text: "Option 1" },
        { id: "option-2", display_text: "Option 2" }
      ]
    }
  };

  it("renders panel", () => {
    const { component } = setupMockFormComponent(CheckboxFilter, props);

    expect(component.exists("Panel")).to.be.true;
  });

  it("renders checkbox inputs", () => {
    const { component } = setupMockFormComponent(CheckboxFilter, props);

    ["option-1", "option-2"].forEach(
      option => expect(component.exists(`input[value='${option}']`)).to.be.true
    );
  });
});
