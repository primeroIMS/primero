import { setupMockFormComponent, expect } from "../../../../test";

import ToggleFilter from "./toggle-filter";

describe("<ToggleFilter>", () => {
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
    const { component } = setupMockFormComponent(ToggleFilter, props);

    expect(component.exists("Panel")).to.be.true;
  });

  it("renders toggle buttons", () => {
    const { component } = setupMockFormComponent(ToggleFilter, props);

    ["option-1", "option-2"].forEach(
      option => expect(component.exists(`button[value='${option}']`)).to.be.true
    );
  });
});
