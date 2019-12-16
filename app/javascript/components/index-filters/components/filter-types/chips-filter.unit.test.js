import { setupMockFormComponent, expect } from "../../../../test";

import ChipsFilter from "./chips-filter";

describe("<ChipsFilter>", () => {
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
    const { component } = setupMockFormComponent(ChipsFilter, props);

    expect(component.exists("Panel")).to.be.true;
  });

  it("renders chip inputs", () => {
    const { component } = setupMockFormComponent(ChipsFilter, props);

    ["option-1", "option-2"].forEach(
      option => expect(component.exists(`input[value='${option}']`)).to.be.true
    );
  });
});
