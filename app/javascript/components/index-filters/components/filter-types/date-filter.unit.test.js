import { setupMockFormComponent, expect } from "../../../../test";

import DateFilter from "./date-filter";

describe("<DateFilter>", () => {
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
    const { component } = setupMockFormComponent(DateFilter, props);

    expect(component.exists("Panel")).to.be.true;
  });
});
